#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Basic regression tests for the search engine.
Run from repo root:  python -m pytest src/ui-ux-pro-max/scripts/tests/
Or directly:         python src/ui-ux-pro-max/scripts/tests/test_search.py
"""

import sys
import os
import unittest

# Ensure the scripts directory is on the path
_SCRIPTS_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _SCRIPTS_DIR not in sys.path:
    sys.path.insert(0, _SCRIPTS_DIR)

from core import BM25, detect_domain, search, search_stack, CSV_CONFIG, DATA_DIR
from design_system import _sanitize_path_component, _validate_output_dir


class TestBM25Tokenizer(unittest.TestCase):
    def setUp(self):
        self.bm25 = BM25()

    def test_lowercases_input(self):
        tokens = self.bm25.tokenize("Hello World")
        self.assertIn("hello", tokens)
        self.assertIn("world", tokens)

    def test_removes_punctuation(self):
        tokens = self.bm25.tokenize("glassmorphism, minimalism!")
        self.assertIn("glassmorphism", tokens)
        self.assertIn("minimalism", tokens)

    def test_filters_words_two_chars_or_less(self):
        tokens = self.bm25.tokenize("a is in the")
        self.assertEqual(tokens, [])

    def test_returns_list(self):
        self.assertIsInstance(self.bm25.tokenize("any text here"), list)


class TestBM25Scoring(unittest.TestCase):
    def setUp(self):
        self.bm25 = BM25()
        self.docs = [
            "glassmorphism frosted glass blur backdrop",
            "minimalism flat clean simple whitespace",
            "brutalism bold grid raw contrast",
        ]
        self.bm25.fit(self.docs)

    def test_best_match_ranks_first(self):
        scores = self.bm25.score("glass blur")
        self.assertEqual(scores[0][0], 0)  # doc index 0 should win

    def test_scores_are_sorted_descending(self):
        scores = self.bm25.score("minimalism clean")
        vals = [s for _, s in scores]
        self.assertEqual(vals, sorted(vals, reverse=True))

    def test_empty_corpus(self):
        empty = BM25()
        empty.fit([])
        self.assertEqual(empty.score("anything"), [])

    def test_no_matching_query_scores_zero(self):
        scores = self.bm25.score("xyzzy unrelated qqq")
        self.assertTrue(all(s == 0 for _, s in scores))

    def test_exact_term_match_beats_no_match(self):
        scores = self.bm25.score("brutalism")
        top_idx, top_score = scores[0]
        self.assertEqual(top_idx, 2)
        self.assertGreater(top_score, 0)


class TestDetectDomain(unittest.TestCase):
    def test_color_keyword(self):
        self.assertEqual(detect_domain("color palette for SaaS"), "color")

    def test_chart_keyword(self):
        self.assertEqual(detect_domain("bar chart visualization"), "chart")

    def test_ux_keyword(self):
        self.assertEqual(detect_domain("ux accessibility wcag"), "ux")

    def test_typography_keyword(self):
        self.assertEqual(detect_domain("font pairing for headings"), "typography")

    def test_landing_keyword(self):
        self.assertEqual(detect_domain("landing page cta conversion"), "landing")

    def test_unknown_falls_back_to_style(self):
        self.assertEqual(detect_domain("xyzzy completely random"), "style")

    def test_style_keyword(self):
        self.assertEqual(detect_domain("glassmorphism ui style"), "style")


class TestSearchReturnShape(unittest.TestCase):
    """Tests that search() returns the expected dict shape.
    Individual domain tests are skipped when CSV data files are absent."""

    def _skip_if_no_data(self, domain: str) -> None:
        config = CSV_CONFIG.get(domain, {})
        fp = DATA_DIR / config.get("file", "")
        if not fp.exists():
            self.skipTest(f"CSV data not available: {fp}")

    def test_search_style_shape(self):
        self._skip_if_no_data("style")
        result = search("glassmorphism", "style", max_results=2)
        self.assertIn("domain", result)
        self.assertIn("results", result)
        self.assertIn("count", result)
        self.assertIn("query", result)
        self.assertIsInstance(result["results"], list)

    def test_search_respects_max_results(self):
        self._skip_if_no_data("style")
        result = search("minimalism", "style", max_results=1)
        self.assertLessEqual(len(result["results"]), 1)

    def test_search_color_shape(self):
        self._skip_if_no_data("color")
        result = search("SaaS product", "color", max_results=1)
        self.assertIn("results", result)

    def test_search_stack_unknown_returns_error(self):
        result = search_stack("button hover", "nonexistent_stack")
        self.assertIn("error", result)

    def test_search_missing_file_returns_error(self):
        result = search("test query", "chart", max_results=1)
        if "error" not in result:
            # File exists — just verify shape
            self.assertIn("results", result)


class TestPathSanitization(unittest.TestCase):
    """Tests for _sanitize_path_component in design_system."""

    def test_normal_slug_passes_through(self):
        self.assertEqual(_sanitize_path_component("my-project"), "my-project")

    def test_empty_string_returns_default(self):
        self.assertEqual(_sanitize_path_component(""), "default")

    def test_rejects_unix_path_separator(self):
        with self.assertRaises(ValueError):
            _sanitize_path_component("../../etc/passwd")

    def test_rejects_windows_path_separator(self):
        with self.assertRaises(ValueError):
            _sanitize_path_component("..\\etc\\passwd")

    def test_rejects_double_dot_traversal(self):
        with self.assertRaises(ValueError):
            _sanitize_path_component("..secret")

    def test_rejects_null_byte(self):
        with self.assertRaises(ValueError):
            _sanitize_path_component("evil\x00name")

    def test_replaces_unsafe_chars(self):
        result = _sanitize_path_component('name<with>bad:chars')
        self.assertNotIn('<', result)
        self.assertNotIn('>', result)
        self.assertNotIn(':', result)

    def test_spaces_in_slug_allowed(self):
        result = _sanitize_path_component("my project")
        self.assertEqual(result, "my project")


class TestValidateOutputDir(unittest.TestCase):
    def test_valid_path_resolves(self):
        import tempfile
        with tempfile.TemporaryDirectory() as td:
            result = _validate_output_dir(td)
            self.assertTrue(result.is_absolute())

    def test_null_byte_rejected(self):
        with self.assertRaises(ValueError):
            _validate_output_dir("/tmp/evil\x00path")


if __name__ == "__main__":
    unittest.main(verbosity=2)

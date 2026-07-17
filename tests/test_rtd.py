"""Tests for the in-process RTD computation (no node/JS required)."""

import os

import pytest

from py_allotax import get_rtd

DATA_1 = os.path.join("example_data", "boys_2022.json")
DATA_2 = os.path.join("example_data", "boys_2023.json")

# Golden values from the original JS implementation (allotaxonometer-ui)
# on boys_2022 vs boys_2023 with alpha=0.17.
EXPECTED_NORMALIZATION = 1692.7561270411318
EXPECTED_TOTAL_WORDS = 1292


def test_get_rtd_matches_js_baseline():
    res = get_rtd(DATA_1, DATA_2, "0.17", top_n=30)

    assert res["rtd"]["normalization"] == pytest.approx(EXPECTED_NORMALIZATION)
    assert res["total_words"] == EXPECTED_TOTAL_WORDS
    assert list(res["words_df"].columns) == ["type", "rank1", "rank2", "rank_diff", "metric"]
    assert len(res["words_df"]) == 30

    top = res["words_df"].iloc[0]
    assert top["type"] == "Grover"
    assert top["rank1"] == 413.5
    assert top["rank2"] == 20.0
    assert top["metric"] == pytest.approx(0.001209, abs=1e-6)


def test_get_rtd_accepts_dataframes_and_dicts():
    import json

    import pandas as pd

    with open(DATA_1) as f:
        records1 = json.load(f)
    with open(DATA_2) as f:
        records2 = json.load(f)

    df1, df2 = pd.DataFrame(records1), pd.DataFrame(records2)

    # top_n=0 (all words) and keying by type avoids order effects: the Rust
    # core's parallel summation is nondeterministic in the last float bits,
    # so the sort order of tied metrics can differ between identical calls.
    from_files = get_rtd(DATA_1, DATA_2, "0.17", top_n=0)
    from_dfs = get_rtd(df1, df2, "0.17", top_n=0)
    from_records = get_rtd(records1, records2, "0.17", top_n=0)

    baseline = from_files["words_df"].sort_values("type").reset_index(drop=True)
    for res in (from_dfs, from_records):
        assert res["rtd"]["normalization"] == pytest.approx(
            from_files["rtd"]["normalization"], rel=1e-9
        )
        words = res["words_df"].sort_values("type").reset_index(drop=True)
        assert (words["type"] == baseline["type"]).all()
        assert words["metric"].values == pytest.approx(
            baseline["metric"].values, rel=1e-6
        )


def test_get_rtd_infinity_alpha():
    res = get_rtd(DATA_1, DATA_2, "Infinity", top_n=5)
    assert res["rtd"]["normalization"] > 0
    assert len(res["words_df"]) == 5

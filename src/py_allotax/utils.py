"""Data coercion and RTD computation helpers."""

import json
import os

import allotax
import pandas as pd


def parse_alpha(alpha) -> float:
    """Parse an alpha argument ("0.17", "Infinity", 0.17, float("inf")) to float."""
    return float(alpha)


def as_system(data) -> dict:
    """Coerce a supported input into the columnar dict allotax expects.

    Accepts:
        - a path to a .json data file containing a list of records,
        - a pandas DataFrame with 'types' and 'counts' columns,
        - a list of records (dicts with 'types' and 'counts' keys),
        - an already-columnar dict with 'types' and 'counts' lists.

    Returns:
        Dict with 'types' (list[str]) and 'counts' (list[float]).
    """
    if isinstance(data, (str, os.PathLike)):
        try:
            with open(data, "r") as f:
                data = json.load(f)
        except json.JSONDecodeError:
            raise ValueError(
                f"Invalid JSON structure in {data}. File should be "
                "a .json wherein the data is a list of dictionaries."
            )
    if isinstance(data, pd.DataFrame):
        missing = {"types", "counts"} - set(data.columns)
        if missing:
            raise ValueError(
                f"DataFrame is missing required column(s): {sorted(missing)}"
            )
        return {
            "types": data["types"].astype(str).tolist(),
            "counts": data["counts"].astype(float).tolist(),
        }
    if isinstance(data, dict):
        if not {"types", "counts"} <= data.keys():
            raise ValueError("dict input must have 'types' and 'counts' keys")
        return {
            "types": [str(t) for t in data["types"]],
            "counts": [float(c) for c in data["counts"]],
        }
    if isinstance(data, list):
        try:
            return {
                "types": [str(r["types"]) for r in data],
                "counts": [float(r["counts"]) for r in data],
            }
        except (TypeError, KeyError):
            raise ValueError(
                "list input must contain records (dicts) with 'types' and 'counts' keys"
            )
    raise TypeError(
        "data must be a path to a .json file, a pandas DataFrame, a list of "
        f"records, or a dict with 'types' and 'counts'; got {type(data).__name__}"
    )


def get_rtd(data1, data2, alpha, top_n: int = 30):
    """Get RTD + words driving divergence as DataFrame.

    Computed in-process via the `allotax` Rust bindings; no node/JS required.

    Args:
        data1: First system — path to a JSON data file, a pandas DataFrame
            with 'types' and 'counts' columns, a list of records, or a
            columnar dict (see `as_system`).
        data2: Second system, same accepted forms.
        alpha: Alpha value ("0.17", "Infinity", or a float).
        top_n: Number of top words to return. Use 0 or -1 for all words.

    Returns:
        Dict with 'rtd' ({'normalization', 'delta_sum'}), 'words_df'
        (DataFrame with type, rank1, rank2, rank_diff, metric), and
        'total_words'.
    """
    result = allotax.rank_turbulence_divergence(
        as_system(data1), as_system(data2), parse_alpha(alpha), limit=0
    )

    words_df = pd.DataFrame(result["wordshift"]).rename(columns={"divergence": "metric"})
    words_df["rank_diff"] = words_df["rank1"] - words_df["rank2"]
    words_df = words_df[["type", "rank1", "rank2", "rank_diff", "metric"]]

    total_words = len(words_df)
    if top_n and top_n > 0:
        words_df = words_df.head(top_n).reset_index(drop=True)

    return {
        "rtd": {
            "normalization": result["normalization"],
            "delta_sum": result["delta_sum"],
        },
        "words_df": words_df,
        "total_words": total_words,
    }

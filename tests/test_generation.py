"""Tests to ensure proper development of py-allotax."""

import os

import pytest

from py_allotax import allotaxonograph, compute_allotax, render_allotaxonograph

DATA_1 = os.path.join("example_data", "boys_1895.json")
DATA_2 = os.path.join("example_data", "boys_1968.json")


@pytest.mark.parametrize("suffix", [".pdf", ".svg", ".html"])
def test_generation_format_from_extension(suffix, tmp_path):
    out = tmp_path / f"test{suffix}"
    allotaxonograph(
        DATA_1,
        DATA_2,
        "0.17",
        "Baby boy names 1895",
        "Baby boy names 1968",
        output_file=str(out),
    )
    assert out.exists()
    assert out.stat().st_size > 0

    if suffix == ".svg":
        content = out.read_text()
        assert content.lstrip().startswith("<svg")


def test_generation_explicit_format(tmp_path):
    out = tmp_path / "chart.out"
    allotaxonograph(
        DATA_1, DATA_2, "0.17", output_file=str(out), desired_format="html"
    )
    assert out.exists()
    assert "allotaxonometer-dashboard" in out.read_text()


def test_inline_figure(tmp_path):
    obj = allotaxonograph(DATA_1, DATA_2, "0.17", "1895", "1968")
    assert obj._repr_svg_().lstrip().startswith("<svg")

    out = tmp_path / "inline.svg"
    obj.save(str(out))
    assert out.exists() and out.stat().st_size > 0


def test_compute_once_render_many(tmp_path):
    plot_data = compute_allotax(DATA_1, DATA_2, "0.17", "1895", "1968")
    assert plot_data["ncells"] > 0
    assert len(plot_data["wordshift"]) > 0

    for fmt in ("svg", "html"):
        out = tmp_path / f"reuse.{fmt}"
        render_allotaxonograph(plot_data, str(out), fmt)
        assert out.exists() and out.stat().st_size > 0


def test_generate_svg_deprecated_alias(tmp_path):
    from py_allotax import generate_svg

    out = tmp_path / "legacy.html"
    with pytest.warns(DeprecationWarning, match="allotaxonograph"):
        generate_svg(DATA_1, DATA_2, str(out), "0.17", "A", "B", "html")
    assert out.exists()

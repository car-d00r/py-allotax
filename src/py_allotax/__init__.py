"""py-allotax: allotaxonographs and rank-turbulence divergence in Python."""

from py_allotax.allotaxonograph import (
    allotaxonograph,
    compute_allotax,
    generate_svg,
    render_allotaxonograph,
)
from py_allotax.utils import as_system, get_rtd

__all__ = [
    "allotaxonograph",
    "compute_allotax",
    "render_allotaxonograph",
    "get_rtd",
    "as_system",
    "generate_svg",  # deprecated alias
]

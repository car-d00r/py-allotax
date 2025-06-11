"""Functions to generate allotaxonometer through Python.
Notes:
As a test, run in terminal:
python3 generate_svg.py convert/boys_2022.json convert/boys_2023.json output_charts/test.pdf "0.17" "Boys 2022" "Boys 2023"

If you only want the html file, not the pdf, run:
python3 generate_svg.py convert/boys_2022.json convert/boys_2023.json output_charts/test.pdf "0.17" "Boys 2022" "Boys 2023" --desired_format "html"
"""

import argparse
import json
import subprocess
import tempfile
from importlib import resources

from py_allotax.utils import convert_html_to_pdf, verify_input_data


def generate_svg(
    json_file_1: str,
    json_file_2: str,
    output_file: str,
    alpha: str,
    title1: str,
    title2: str,
    desired_format: str = "pdf",
) -> None:
    """Generate static allotaxonometer plot using Svelte SSR + Puppeteer.
    Args:
        json_file_1: Path to the first json data file.
        json_file_2: Path to the second json data file.
        output_file: Path to save the output file.
        alpha: Alpha value for allotaxChart.
        title1: Title for System 1.
        title2: Title for System 2.
        desired_format (optional): Desired output format (default: pdf).
    """
    # Verify the input data and read in .json data files as text
    verify_input_data(json_file_1, json_file_2)
    with open(json_file_1, "r") as file:
        data1_json = json.loads(file.read())
    with open(json_file_2, "r") as file:
        data2_json = json.loads(file.read())

    # Write the json data to a temporary file (same as before)
    temp_file_path = tempfile.mktemp(suffix=".mjs")
    with open(temp_file_path, "w") as file:
        file.write(f"const data1 = {json.dumps(data1_json)};\n")
        file.write(f"const data2 = {json.dumps(data2_json)};\n")
        file.write(f"const alpha = {alpha};\n")
        file.write(f"const title1 = \"{title1}\";\n")
        file.write(f"const title2 = \"{title2}\";\n")
        file.write("export { data1, data2, alpha, title1, title2 };")  # Note: export instead of module.exports

    # Choose the appropriate JS file based on desired format
    if desired_format == "pdf":
        js_file_path = resources.files('py_allotax').joinpath('generate_svg_minimum.js')
        command = ["node", str(js_file_path), temp_file_path, output_file]
    else:
        # Keep the old HTML generation for backwards compatibility
        js_file_path = resources.files('py_allotax').joinpath('generate_svg_minimum.js')
        command = ["node", str(js_file_path), temp_file_path]

    # Run the JS file and capture the output
    result = subprocess.run(command, capture_output=True, text=True)

    # Check if the command was successful
    if result.returncode == 0:
        if desired_format == "html":
            # Save HTML output for HTML format
            file_name = output_file.rsplit(".", 1)[0]
            with open(f"{file_name}.html", "w") as file:
                file.write(result.stdout)
            print(f"HTML saved to {file_name}.html")
        else:
            # PDF was generated directly by Puppeteer
            print(f"PDF saved to {output_file}")
    else:
        raise Exception(f"Error in Graph Generation: {result.stderr}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Generate allotaxonometer plot."
    )
    parser.add_argument(
        "json_file_1", type=str, help="Path to the first json data file."
    )
    parser.add_argument(
        "json_file_2", type=str, help="Path to the second json data file."
    )
    parser.add_argument(
        "output_file", type=str, help="Path to save the output pdf file."
    )
    parser.add_argument("alpha", type=str, help="Alpha value.")
    parser.add_argument("title1", type=str, help="Title for system 1")
    parser.add_argument("title2", type=str, help="Title for system 2.")

    # Optional argument
    parser.add_argument(
        "--desired_format",
        type=str,
        default="pdf",
        choices=["pdf", "html"],
        help="Desired output format (default: pdf).",
    )

    args = parser.parse_args()

    generate_svg(
        args.json_file_1,
        args.json_file_2,
        args.output_file,
        args.alpha,
        args.title1,
        args.title2,
        args.desired_format,
    )

import os
import subprocess
from py_allotax.generate_svg import generate_svg

def test_generation():
    try:
        print("Starting test generation...")
        
        # Check if input files exist
        file1 = os.path.join("example_data", "boys_2022.json")
        file2 = os.path.join("example_data", "boys_2023.json")
        
        print(f"Checking input files:")
        print(f"  {file1} exists: {os.path.exists(file1)}")
        print(f"  {file2} exists: {os.path.exists(file2)}")
        
        if not os.path.exists(file1) or not os.path.exists(file2):
            print("Input files missing!")
            return
        
        generate_svg(
            file1, 
            file2, 
            os.path.join("tests", "test.pdf"), 
            "0.17", 
            "Boys 2022", 
            "Boys 2023"
        )
        
        pdf_path = os.path.join("tests", "test.pdf")
        html_path = os.path.join("tests", "test.html")
        
        print(f"Checking output files:")
        print(f"  {html_path} exists: {os.path.exists(html_path)}")
        print(f"  {pdf_path} exists: {os.path.exists(pdf_path)}")
        
        assert(os.path.exists(pdf_path))
        assert(os.path.exists(html_path))
        print("Test passed!")
        
    except Exception as e:
        print(f"Error in test: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_generation()
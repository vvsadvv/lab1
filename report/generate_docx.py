from pathlib import Path
from shutil import copyfile

ROOT = Path(__file__).resolve().parents[1]
report_dir = ROOT / "report"

source = report_dir / "LAB2_REPORT.docx"
target = report_dir / "REPORT.docx"

if not source.exists():
  raise FileNotFoundError("LAB2_REPORT.docx не найден. Сначала запустите generate_lab2_docx.py")

copyfile(source, target)
print(str(target))

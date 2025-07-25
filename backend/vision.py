import os

def analyze_chart_image(image_path: str) -> str:
    """
    Analisis sederhana gambar chart.
    Versi awal ini hanya memberi tanggapan placeholder dan nama file.
    """

    # Extract nama file saja
    filename = os.path.basename(image_path)

    # Simulasi hasil analisis — nanti bisa diganti dengan AI Vision model
    analysis_result = f"Saya telah menerima grafik `{filename}` dan sedang menganalisisnya. \
Saat ini saya belum bisa membaca data candlestick secara visual penuh, \
namun saya bisa memproses gambar ini jika Anda memberi tahu timeframe atau sinyal yang dicari."

    return analysis_result

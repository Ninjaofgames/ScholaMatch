from rest_framework.decorators import api_view
from rest_framework.response import Response
import io
import csv

@api_view(['GET'])
def test_connection(request):
    return Response({"message": "Connection successful!"})

@api_view(['POST'])
def upload_csv(request):
    file = request.FILES.get('file')
    if not file:
        return Response({"error": "No file uploaded"}, status=400)
    if not file.name.endswith('.csv'):
        return Response({"error": "File must be a CSV"}, status=400)
    decoded_file = file.read().decode('utf-8')
    reader = csv.reader(io.StringIO(decoded_file))
    rows = []
    for row in reader:
        rows.append(row)
    return Response({
        "message": "File uploaded successfully!",
        "filename": file.name,
        "rows": len(rows)
    })
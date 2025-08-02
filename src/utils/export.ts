import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export const exportToPDF = (data: any[], title: string, columns: string[]) => {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(18);
  doc.text(title, 20, 20);
  
  // Data atual
  doc.setFontSize(10);
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 30);
  
  // Cabeçalhos
  let yPosition = 50;
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  
  columns.forEach((column, index) => {
    doc.text(column, 20 + (index * 40), yPosition);
  });
  
  // Dados
  yPosition += 10;
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  
  data.forEach((row, rowIndex) => {
    if (yPosition > 280) { // Nova página se necessário
      doc.addPage();
      yPosition = 20;
    }
    
    columns.forEach((column, colIndex) => {
      const cellValue = row[column.toLowerCase().replace(' ', '_')] || '';
      doc.text(String(cellValue), 20 + (colIndex * 40), yPosition);
    });
    
    yPosition += 8;
  });
  
  doc.save(`${title.toLowerCase().replace(' ', '_')}.pdf`);
};

export const exportToExcel = (data: any[], title: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  
  XLSX.utils.book_append_sheet(workbook, worksheet, title);
  
  // Ajustar largura das colunas
  const colWidths = Object.keys(data[0] || {}).map(() => ({ wch: 15 }));
  worksheet['!cols'] = colWidths;
  
  XLSX.writeFile(workbook, `${title.toLowerCase().replace(' ', '_')}.xlsx`);
};

export const exportToCSV = (data: any[], title: string) => {
  if (!data.length) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header] || '';
        // Escapar aspas e envolver em aspas se contém vírgula
        return typeof value === 'string' && value.includes(',') 
          ? `"${value.replace(/"/g, '""')}"` 
          : value;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${title.toLowerCase().replace(' ', '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
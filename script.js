document.addEventListener('DOMContentLoaded', function () {
    const jpegFileInput = document.getElementById('jpegFile');
    const convertBtn = document.getElementById('convertBtn');
    const downloadLinkContainer = document.getElementById('downloadLinkContainer');
    const downloadLink = document.getElementById('downloadLink');
    const customFileLabel = document.querySelector('.custom-file-label');

    let selectedFile = null;

    jpegFileInput.addEventListener('change', function (event) {
        selectedFile = event.target.files[0];
        if (selectedFile) {
            customFileLabel.textContent = selectedFile.name;
            convertBtn.disabled = false;
        } else {
            customFileLabel.textContent = 'Choose file';
            convertBtn.disabled = true;
        }
        downloadLinkContainer.style.display = 'none';
    });

    convertBtn.addEventListener('click', function () {
        if (!selectedFile) {
            return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
            const imgData = event.target.result;
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            const img = new Image();
            img.src = imgData;
            img.onload = function () {
                const imgWidth = img.width;
                const imgHeight = img.height;
                const pdfWidth = doc.internal.pageSize.getWidth();
                const pdfHeight = doc.internal.pageSize.getHeight();

                const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
                const newImgWidth = imgWidth * ratio;
                const newImgHeight = imgHeight * ratio;

                const x = (pdfWidth - newImgWidth) / 2;
                const y = (pdfHeight - newImgHeight) / 2;

                doc.addImage(imgData, 'JPEG', x, y, newImgWidth, newImgHeight);
                const pdfBlob = doc.output('blob');
                const pdfUrl = URL.createObjectURL(pdfBlob);

                downloadLink.href = pdfUrl;
                downloadLink.download = selectedFile.name.replace('.jpeg', '').replace('.jpg', '') + '.pdf';
                downloadLinkContainer.style.display = 'block';
            };
        };
        reader.readAsDataURL(selectedFile);
    });
});
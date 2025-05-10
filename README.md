# 

<div align="center">
   <h1>nodejs_pdf_ocr</h1>
</div>

This implementation demonstrates a production-grade solution for automated form processing, particularly suitable for HR systems needing to handle high volumes of standardized employment documents. 



The coordinate-based approach ensures reliability with structured forms while maintaining flexibility through dynamic position calibration.



### Input PDF and Result:

<div align="center">
   <img src=https://github.com/LucaIT523/nodejs_pdf_ocr/blob/main/images/1.png>
</div>

<div align="center">
   <img src=https://github.com/LucaIT523/nodejs_pdf_ocr/blob/main/images/2.png>
</div>

### 1. Core Architecture

**A. Modular Section Handling**

```
const section_1_infoList = [ 
  { key: 'Last Name', position: [77, 362, 411, 391] },
  { key: 'First Name', position: [415, 362, 711, 391] }
];
```

- **4 Predefined Sections**: Employee info, Employer review, Supplement B, and Supplement A
- **Coordinate-Based Mapping**: Each field has precise pixel coordinates (x0,y0,x1,y1)

**B. OCR Pipeline**

```

Image Input → Preprocessing → Text Detection → Data Cleansing → Structured Output
```

- Uses Tesseract.js for OCR with custom text normalization
- Jimp library for image manipulation

### 2. Key Components

**A. Image Processing**

```
async function myimage_splite() {
  const croppedImage = image.crop(x, y, width, height);
}
```

- Dynamic coordinate adjustment based on section headers
- Automatic image size detection

**B. Text Recognition**

```
async function recognizeWords() {
  const { data } = await Tesseract.recognize(imagePath, 'eng');
  return [lines, words];
}
```

- Returns text with bounding box coordinates
- Confidence scoring for OCR results

**C. Data Validation**

```
javascriptCopyfunction checkImgSize(x0, y0, x_w, y_h, img_w, img_h) {
  // Boundary checks
  return (x0 >=0 && y0 >=0 && x0+x_w <= img_w && y0+y_h <= img_h);
}
```

- Prevents out-of-bounds cropping errors
- Fallback handling for invalid coordinates

### 3. Specialized Processing

**A. Field-Specific Cleanup**

```
// Social Security Number formatting
str_text = str_text.replace(/¢/g, "6").replace(/ /g, "");
```

- Custom regex replacements per data type
- Removal of OCR artifacts (~~, oo)

**B. Section Alignment**

```
diff_x0 = line.location.left - temp_section_basic_x0;
diff_y0 = line.location.top - temp_section_basic_y0;
```

- Dynamic position calibration using section headers
- Compensation for document scanning variations

### 4. Operational Features

**A. Temp File Management**

```
javascript
Copy
tempFolder = "./temp_" + randomString(12);
```

- Unique temp directories per process
- Automatic cleanup post-processing

**B. Error Handling**

- Async/await pattern with timeout controls
- Boolean flags for OCR completion tracking
- Section validation through header detection

### 5. Data Structure

**Output Format**

```
[
  { 
    key: 'U.S. Social Security Number',
    result_text: '123-45-6789',
    position: [314,470,528,499]
  }
]
```

- Structured JSON output preserving spatial data
- Field-level confidence scores (implicit in OCR results)











### **Contact Us**

For any inquiries or questions, please contact us.

telegram : @topdev1012

email :  skymorning523@gmail.com

Teams :  https://teams.live.com/l/invite/FEA2FDDFSy11sfuegI
var Jimp = require('jimp');
const fs = require('fs');
const path = require('path');
const Tesseract = require('tesseract.js');


diff_x0 = 0;
diff_y0 = 0;
calc_img_cnt = 0;
total_item_cnt = 0;
OK_OCR = false;
tempFolder = "./temp_";
inputImg_w = 0;
inputImg_h = 0;

//. Section 1 Information
const section_1_find_str = "Section 1. Employee Information and Attestation:";
const section_1_basic_x0 = 80;
const section_1_basic_y0 = 295;
const section_1_infoList = [
  { key: 'Last Name (Family Name)', result_text: '', position: [77, 362, 411, 391] },
  { key: 'First Name (Given Name)', result_text: '', position: [415, 362, 711, 391] },
  { key: 'Middle Initial (if any)', result_text: '', position: [714, 362, 861, 391] },
//  { key: 'Other Last Names Used (if any)', result_text: '', position: [864, 362, 1198, 391]},
  { key: 'Address (Street Number and Name)', result_text: '', position: [77, 413, 474, 443]},
  { key: 'Apt. Number (if any)', result_text: '', position: [477, 413, 624, 443]},
  // { key: 'City or Town', result_text: '', position: [626, 413, 948, 443]},
  // { key: 'State', result_text: '', position: [952, 413, 1048, 443]},
  // { key: 'ZIP Code', result_text: '', position: [1052, 413, 1198, 443]},

  // { key: 'Date of Birth (mm-dd-yyyy)', result_text: '', position: [77, 467, 298, 499]},
  { key: 'U.S. Social Security Number', result_text: '', position: [314, 470, 528, 499]},
  { key: `Employee's Email Address`, result_text: '', position: [539, 467, 936, 499]},
  { key: `Employee's Telephone Number`, result_text: '', position: [939, 467, 1199, 499]}
  // { key: 'Signature of Employee', result_text: '', position: [77, 746, 760, 773]},
  // { key: `Today's Date (mm-dd-yyyy)`, result_text: '', position: [764, 746, 1198, 773]}
];

//. Section 2 Information
const section_2_find_str = "Section 2. Employ Review and Verification:";
const section_2_basic_x0 = 80;
const section_2_basic_y0 = 808;
const section_2_infoList = [
  //. Document Title 1 List A
  { key: 'Document Title 1 - List A', result_text: '', position: [264, 902, 548, 936] },
  { key: 'Issuing Authority(Title 1 - List A)', result_text: '', position: [264, 940, 548, 974] },
  { key: 'Document Number(Title 1 - List A)', result_text: '', position: [264, 977, 548, 1012] },
  { key: 'Expiration Date(Title 1 - List A)', result_text: '', position: [264, 1015, 548, 1049]},

  //. Document Title 1 List B
  { key: 'Document Title 1 - List B', result_text: '', position: [577, 902, 873, 936] },
  { key: 'Issuing Authority(Title 1 - List B)', result_text: '', position: [577, 940, 873, 974] },
  { key: 'Document Number(Title 1 - List B)', result_text: '', position: [577, 977, 873, 1012] },
  { key: 'Expiration Date(Title 1 - List B)', result_text: '', position: [577, 1015, 873, 1049]},

  //. Document Title 1 List C
  { key: 'Document Title 1 - List C', result_text: '', position: [877, 902, 1198, 936] },
  { key: 'Issuing Authority(Title 1 - List C)', result_text: '', position: [877, 940, 1198, 974] },
  { key: 'Document Number(Title 1 - List C)', result_text: '', position: [877, 977, 1198, 1012] },
  { key: 'Expiration Date(Title 1 - List C)', result_text: '', position: [877, 1015, 1198, 1049]},

  //. Document Title 2 List A
  { key: 'Document Title 2 - List A', result_text: '', position: [264, 1052, 548, 1086] },
  { key: 'Issuing Authority(Title 2 - List A)', result_text: '', position: [264, 1089, 548, 1123] },
  { key: 'Document Number(Title 2 - List A)', result_text: '', position: [264, 1126, 548, 1162] },
  { key: 'Expiration Date(Title 2 - List A)', result_text: '', position: [264, 1165, 548, 1199]},


  { key: 'Last Name, FirstName and Title of Employer or Authorized Representative', result_text: '', position: [77, 1436, 598, 1486]},
  { key: 'First Day of Employment:(mm-dd-yyy)', result_text: '', position: [954, 1387, 1197, 1419]}
];


//. Section 3 Information
const section_3_find_str = "Supplement B, us";
const section_3_basic_x0 = 550;
const section_3_basic_y0 = 40;
const section_3_infoList = [
  //. Line 1
  { key: 'Last Name (Family Name) from Section 1', result_text: '', position: [79, 240, 536, 278] },
  { key: 'First Name (Given Name) from Section 1', result_text: '', position: [540, 240, 911, 278] },
  { key: 'Middle initial (if any) from Section 1', result_text: '', position: [914, 240, 1199, 278] },
  //. Line 2
  { key: 'Date of Rehire(if applicable)', result_text: '', position: [78, 452, 286, 489]},
  { key: 'New Name (if applicable)', result_text: '', position: [290, 452, 698, 489]},
  { key: 'First Name (Given Name)', result_text: '', position: [702, 452, 1074, 489]},
  { key: 'Middle Initial', result_text: '', position: [1077, 452, 1199, 489]},
  //. Line 3
  { key: 'Document Title', result_text: '', position: [78, 563, 498, 590]},
  { key: 'Document Number (if any)', result_text: '', position: [503, 563, 923, 590]},
  { key: 'Expiration Date (if any) (mm-dd-yyyy)', result_text: '', position: [928, 563, 1199, 590]},
  //. Line 4
  { key: 'Name of Employer or Authorized Representative', result_text: '', position: [78, 674, 498, 711]}
  // { key: 'Signature of Employer or Authorized Representative', result_text: '', position: [502, 674, 973, 711]},
  // { key: `Today's Date (mm-dd-yyyy)`, result_text: '', position: [977, 674, 1198, 711]},
  // //. Lin5
  // { key: 'Additional Information (Initial and date each notation)', result_text: '', position: [77, 736, 939, 783]}
];

//. Section 4 Information (Section 1- prepare_translator)
const section_4_find_str = "Supplement A, us";
const section_4_basic_x0 = 550;
const section_4_basic_y0 = 40;
const section_4_infoList = [
  //. Line 1
  { key: 'Last Name (Family Name) from Section 1', result_text: '', position: [77, 243, 535, 275] },
  { key: 'First Name (Given Name) from Section 1', result_text: '', position: [539, 243, 911, 275] },
  { key: 'Middle initial (if any) from Section 1', result_text: '', position: [914, 243, 1199, 275] },
  // //. Line 2
  // { key: 'Signature of Preparer or Translator', result_text: '', position: [77, 475, 860, 522]},
  // { key: 'Date (mm-dd-yyyy)', result_text: '', position: [864, 475, 1198, 522]},
  //. Line 3
  { key: 'Last Name (Family Name)', result_text: '', position: [77, 552, 561, 586]},
  { key: 'First Name (Given Name)', result_text: '', position: [565, 552, 1024, 586]},
  { key: 'Middle Initial (if any)', result_text: '', position: [1027, 552, 1199, 586]},
  //. Line 4
  { key: 'Address (Street Number and Name)', result_text: '', position: [77, 616, 611, 646]},
  { key: 'City or Town', result_text: '', position: [614, 616, 936, 646]},
  { key: 'State', result_text: '', position: [940, 616, 1024, 646]},
  { key: 'ZIP Code', result_text: '', position: [1028, 616, 1199, 646]}
];


async function myimage_splite(inputImagePath, outputImagePath, x, y, width, height) {
  try {
    // Load the input image using Jimp
    const image = await Jimp.read(inputImagePath);

    // Crop the specified rectangular area using Jimp
    const croppedImage = image.crop(x, y, width, height);

    // Save the cropped image to the specified output path
    await croppedImage.writeAsync(outputImagePath);

//    console.log(`Image cropped and saved to ${outputImagePath}`);
  } catch (error) {
//    console.error('Error:', error);
  }
}
function myimage_size(inputImagePath) {
  // Open the image
  Jimp.read(inputImagePath)
    .then(image => {
      // Get the size of the image
      inputImg_w = image.getWidth();
      inputImg_h = image.getHeight();
      //console.log(`Image size: ${inputImg_w}x${inputImg_h}`); 
    })
    .catch(err => {
      console.error(err);
    });
}
async function recognizeWords(imagePath) {
  const { data } = await Tesseract.recognize(imagePath, 'eng');
  //console.log(data);
  const lines = [];
  const words = [];
  data.lines.forEach(line => {
    const lineInfo = {
      text: line.text,
      confidence: line.confidence,
      location: {
        left: line.bbox.x0,
        top: line.bbox.y0,
        right: line.bbox.x1,
        bottom: line.bbox.y1
      }
    };
    lines.push(lineInfo);

    line.words.forEach(word => {
      const wordInfo = {
        text: word.text,
        confidence: word.confidence,
        location: {
          left: word.bbox.x0,
          top: word.bbox.y0,
          right: line.bbox.x1,
          bottom: line.bbox.y1
        }
      };
      words.push(wordInfo);
    });
  });
  
  return [lines, words];
}

async function sub_recognizeWords(imagePath) {
  const { data } = await Tesseract.recognize(imagePath, 'eng');
  const lines = [];
  data.lines.forEach(line => {
    const lineInfo = {
      text: line.text
    };
    lines.push(lineInfo);
  });
  return [lines];
}

// Function to search for an item by ID
function searchById(key) {
  return dataList.find(item => item.key === key);
}

// Function to add a new item to the data list
//function addItem(item) {
//  dataList.push(item);
//}

// Function to modify an item's display and symbol properties by ID
function modifyItem(id, newDisplay) {
  const item = searchById(id);
  if (item) {
    item.result_text = newDisplay;
    item.position = newSymbol;
  }
}

function checkImgSize(x0, y0, x_w, y_h, img_w, img_h) {

  if(x0 < 0 || y0 < 0){
    return false;
  }
  if(x0 >= img_w || y0 >= img_h){
    return false;
  }
  if(x0 + x_w > img_w || y0 + y_h> img_h){
    return false;
  }
  return true;
}


async function check_word_info(imgPath, img_w, img_h, data_List, ptempFolder) {
  return new Promise((resolve, reject) => {

    for(let i = 0; i < data_List.length; i++){
      let outimgPath = ptempFolder + data_List[i].key + '_temp.png';
      let x0 = data_List[i].position[0] + diff_x0;
      let y0 = data_List[i].position[1] + diff_y0;
      let x_w = data_List[i].position[2] - data_List[i].position[0];
      let y_h = data_List[i].position[3] - data_List[i].position[1];

      if(checkImgSize(x0, y0, x_w, y_h, img_w, img_h) == false){
        calc_img_cnt++;
        continue;        
      }

      myimage_splite(imgPath, outimgPath, x0, y0, x_w, y_h);
      sub_recognizeWords(outimgPath)
      .then(([lines]) => {
        // console.log(outimgPath)
        calc_img_cnt++;
        lines.forEach(line => {
            // console.log(line.text)
            let text_str = line.text;
            temp_str = data_List[i].result_text;
            temp_str += line.text;
            data_List[i].result_text = temp_str;  
          });
      })
      .catch(err => {
        reject(new Error('Operation failed'));
      });
    }

  });
}

function checkValue() {
  if (calc_img_cnt >= total_item_cnt) {
    OK_OCR = true;
  } else {
    setTimeout(checkValue, 100); // Check again after 100ms
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function deleteFilesInFolder(folderPath) {
  // Read the contents of the folder
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      return;
    }

    // Iterate through each file in the folder
    files.forEach((file) => {
      // Create the full path to the file
      const filePath = path.join(folderPath, file);

      // Delete the file
      fs.unlink(filePath, (err) => {
        if (err) {
          return;
        }
      });
    });
  });
  // fs.rmdir(folderPath, { 
  //   recursive: false, 
  // }, (error) => { 
  //   if (error) { 
  //     console.log(error); 
  //   } 
  //   else { 
  //     console.log("Non Recursive: Directories Deleted!"); 
  //   } 
  // }); 
}

function randomString(length) {
    var pattern = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += pattern[Math.floor(Math.random() * pattern.length)];
    return result;
}


async function ocr_main(imagePath, sectionOpt) 
{
  myimage_size(imagePath);
  let img_w = 0;
  let img_h = 0;

  while(true){
    if(inputImg_w > 0 && inputImg_h > 0){
      img_w = inputImg_w;
      img_h = inputImg_h;
      break;
    }
    else{
      await sleep(100);
    }
  }

  if(sectionOpt == 1){
    temp_section_str = section_1_find_str;
    temp_data_list = section_1_infoList;
    temp_section_basic_x0 = section_1_basic_x0;
    temp_section_basic_y0 = section_1_basic_y0;
  }
  else if(sectionOpt == 2){
    temp_section_str = section_2_find_str;
    temp_data_list = section_2_infoList;
    temp_section_basic_x0 = section_2_basic_x0;
    temp_section_basic_y0 = section_2_basic_y0;
  }
  else if(sectionOpt == 3){
    temp_section_str = section_3_find_str;
    temp_data_list = section_3_infoList;
    temp_section_basic_x0 = section_3_basic_x0;
    temp_section_basic_y0 = section_3_basic_y0;
  }
  else if(sectionOpt == 4){
    temp_section_str = section_4_find_str;
    temp_data_list = section_4_infoList;
    temp_section_basic_x0 = section_4_basic_x0;
    temp_section_basic_y0 = section_4_basic_y0;
  }
  else{

  }
  //. Create Temp Folder
  var rd_str = randomString(12);
  tempFolder = tempFolder + rd_str + "/";
  if (!fs.existsSync(tempFolder)) {
    fs.mkdirSync(tempFolder);
  } 

  let b_find_key_line = false;
  let b_OCRResult = false;

  recognizeWords(imagePath)
  .then(([lines, words]) => {

    lines.forEach(line => {
      let text_str = line.text;
      text_str = text_str.toString().toLowerCase();
      temp_section_str = temp_section_str.toString().toLowerCase();
      if (text_str.includes(temp_section_str)) {
        // console.log(line.text);
        // console.log(line.location);
        b_find_key_line = true;
        diff_x0 = line.location.left - temp_section_basic_x0;
        diff_y0 = line.location.top - temp_section_basic_y0;
      }
    });
    total_item_cnt = temp_data_list.length;
    check_word_info(imagePath, img_w, img_h, temp_data_list, tempFolder)
    checkValue();
  })
  .catch(err => {
    console.error('Error:', err);
  });

  //. 
  while(true){
    if(OK_OCR == true){
      break;
    }
    else{
      await sleep(100);
    }
  }
  //. output
  for(let i = 0; i < temp_data_list.length; i++){
    let str_text = temp_data_list[i].result_text;
    str_text = str_text.replace(/oo/g, "");
    str_text = str_text.replace(/~~/g, "");

    if(sectionOpt == 1){
      if(temp_data_list[i].key == 'U.S. Social Security Number'){
        //. custom
        str_text = str_text.replace(/¢/g, "6");
        str_text = str_text.replace(/ /g, "");

      }
    }
    if(sectionOpt == 2){
      if(temp_data_list[i].key == 'Last Name, FirstName and Title of Employer or Authorized Representative'){
        str_text = str_text.replace(/=/g, "");
        str_text = str_text.replace(/©/g, "");
      }
    }

    temp_data_list[i].result_text = str_text;
  }
  deleteFilesInFolder(tempFolder);
  b_OCRResult = true;
  
  if(b_find_key_line == false){
    console.log("Error ... Section Type Param");
    b_OCRResult = false;
  }
  return [temp_data_list, b_OCRResult];
}

module.exports = ocr_main;

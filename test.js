const ocr_main = require('./ocr_engine.js');


console.log('-----My OCR start---------');
ocr_main('./1.png', 1)
  .then(([temp_data_list, b_OCRResult]) => {
    if(b_OCRResult == true){
      for(let i = 0; i < temp_data_list.length; i++){
        //. All View
        console.log(temp_data_list[i].key);
        console.log(temp_data_list[i].result_text);

        // //. if result_text
        // if(temp_data_list[i].result_text.length > 0){
        //   console.log(temp_data_list[i].key);
        //   console.log(temp_data_list[i].result_text);
        // }
      }
    }

    console.log('-----My OCR end---------');
  })
  .catch(err => {
    console.error('Error:', err);
  }); 


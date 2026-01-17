const { createWorker } = require('tesseract.js');
const fs = require('fs');

async function convertImageToHtml(imagePath) {
  const worker = await createWorker('chi_sim+eng'); // 支持中英文
  
  console.log('正在识别图片内容...');
  const { data: { text, blocks } } = await worker.recognize(imagePath);
  
  await worker.terminate();
  
  console.log('识别完成，正在生成HTML...');
  
  // 生成HTML结构
  let html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>图片识别结果</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.6;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
        }
        h1 {
            color: #333;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        .image-info {
            margin-bottom: 20px;
            color: #666;
        }
        .content {
            white-space: pre-wrap;
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>图片识别结果</h1>
        <div class="image-info">
            <p>图片文件: ${imagePath}</p>
            <p>识别时间: ${new Date().toLocaleString()}</p>
        </div>
        <div class="content">
            ${text}
        </div>
    </div>
</body>
</html>`;
  
  // 写入HTML文件
  const htmlPath = imagePath.replace(/\.[^/.]+$/, '') + '.html';
  fs.writeFileSync(htmlPath, html);
  
  console.log(`HTML已生成: ${htmlPath}`);
  return htmlPath;
}

// 执行转换
const imagePath = '416f01198014de7a8c3a2ff32642021d.jpg';
convertImageToHtml(imagePath)
    .then(htmlPath => {
        console.log('转换完成！');
        console.log(`查看结果: ${htmlPath}`);
    })
    .catch(error => {
        console.error('转换失败:', error);
    });

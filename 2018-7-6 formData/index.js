window.onload = function () {
    var formData = new FormData();
    formData.append('upload', 30);
    console.log(formData.get('upload'))
    // 上传文件需要先通过 formData 转成二进制格式
}
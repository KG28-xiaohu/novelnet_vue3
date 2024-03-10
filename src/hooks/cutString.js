let cutString = (str, strNum) => {
    if (str.length > strNum) {
        return str.substring(0, strNum) + "..."; // 使用substring方法截取前三十位，并添加省略号
    }
    return str; // 如果字符串长度小于或等于三十位，直接返回原字符串
};

let lineFeed = (str) => {
    return str.split("/n");
}

export { cutString, lineFeed };
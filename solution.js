const base = 'http://wp8m3he1wt.s3-website-ap-southeast-2.amazonaws.com';

let getRequest = (url) => {
    return new Promise((resolve, reject) => {
        
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open('GET', url);
        xhr.send();
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4){
                if(xhr.status >= 200 && xhr.status < 300){
                    resolve(xhr.response);
                }else{
                    reject(xhr.status);
                }
            }
        }
    });
}

let getCubicWeight = (size) => {
    return size.length/100 * size.width/100 * size.height/100 * 250;
}

let getAverageCubicWeight = async () => {
    let endpoint = '/api/products/1';
    let keyword = 'Air Conditioners';
    let totalCubicWeight = 0;
    let number = 0;
    while (true) {
        let response = await getRequest(base + endpoint);
        for (let obj of response.objects) {
            if (obj.category === keyword) {
                number++;
                totalCubicWeight += getCubicWeight(obj.size);
            }
        }
        if (!response.next) 
            break;
        else 
            endpoint = response.next;
    }
    console.log(totalCubicWeight/number);
    return number === 0 ? '0' : Math.ceil(totalCubicWeight/number*10)/10 + ' kg';
}

let main = () => {
    let btn = document.querySelector('#btn');
    let result = document.querySelector('#result');
    result.style.display = 'inline';
    btn.style.display = 'none';
    getAverageCubicWeight().then(avg => result.innerHTML = avg);
};

btn.addEventListener('click', main);
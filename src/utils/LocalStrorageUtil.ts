export function useLocalStorage(){
    try{
        localStorage.setItem('xxxx','xxxx');
    }catch(e){
        console.log('无痕模式下不能使用localStorage');
        return false;
    }
    return true;
}

//FIXME use localstrorage
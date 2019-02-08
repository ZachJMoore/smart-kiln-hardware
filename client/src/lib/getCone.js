const getCone = (nb)=>{
    if (`${nb}`.includes("-")){
        return `0${Math.abs(nb)}`
    } else {
        return `${nb}`
    }
}

export default getCone
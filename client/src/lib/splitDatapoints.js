export default function splitDatapoints(array, lenience = 3){

    let ln = lenience * 60 * 1000

    let splits = []
    let ns = (v)=>{splits.push([v])}
    let ps = (v)=>{splits[splits.length-1].push(v)}

    array.forEach((value, index)=>{
        if (index === 0){
            splits[0]=[value]
        } else {
            let cs = splits[splits.length-1]

            if (value.created_at > cs[cs.length - 1].created_at + ln){
                // Is too old.
                ns(value)
            } else {
                ps(value)
            }
        }
    })

    let rt = []

    splits.forEach((a, index)=>{
        rt.push(...a)
        if (index !== splits.length -1) rt.push(null)
    })

    return rt
}
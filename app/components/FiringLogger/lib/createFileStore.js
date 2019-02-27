module.exports = ()=>{
    class FileStore extends this.getFileStore(){
        constructor(props){
            super(props)

            this.logBackupPath = "backup/logs"
        }

        writeTest(fileName, data){
            this.directory.write(`${fileName}.json`, data, {
                atomic: true
            })
        }

        getAllLogPaths(){
            let array = this.directory.list(this.logBackupPath)
            if (Array.isArray(array)) return array
            else return []
        }
    }

    this.fileStore = new FileStore()
}
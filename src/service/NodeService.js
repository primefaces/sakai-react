import axios from 'axios';

export class NodeService {

    getFiles(_this) {
        return axios.get('assets/demo/data/files.json')
            .then(res => res.data.data)
            .then(data => {
                _this.setState({ files: data });
                return data;
            });
    }

    getFilesystem(_this) {
        return axios.get('assets/demo/data/filesystem.json')
            .then(res => res.data.data)
            .then(data => {
                _this.setState({ files: data });
                return data;
            });

    }
}
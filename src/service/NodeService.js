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

    getTreeNodes() {
        return axios.get('assets/demo/data/treenodes.json')
            .then(res => res.data.root);
    }

	getTreeTableNodes() {
		return axios.get('assets/demo/data/treetablenodes.json')
			.then(res => res.data.root);
	}
}
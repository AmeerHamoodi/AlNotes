import React from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "semantic-ui-react";

import UpdateStore from "../stores/homePage/UpdateStore";

const updateStore = new UpdateStore();

const Update = observer(() => {
    return (
        <Modal size="tiny">
            <Modal.Header className="header">Updating</Modal.Header>
            <Modal.Content>{updateStore.updateContent.progress}</Modal.Content>
        </Modal>
    );
});

export default Update;

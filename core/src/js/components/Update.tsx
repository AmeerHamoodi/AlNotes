import React from "react";
import { observer } from "mobx-react-lite";

import UpdateStore from "../stores/updateStore";

const updateStore = new UpdateStore();

const Update = observer(() => {

    return (
        <div className="ui modal tiny">
            <div className="header" style={{textAlign: "center"}}>Updating</div>
            <div className="content">
                {updateStore.updateContent.progress}
            </div>
        </div>
    )
});

export default Update;
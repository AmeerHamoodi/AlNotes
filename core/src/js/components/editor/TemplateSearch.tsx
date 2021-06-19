import React, { useState } from "react";
import { observer } from "mobx-react-lite";

import { Dropdown, DropdownProps } from "semantic-ui-react";

import {
    NoteStoreInterface,
    StudySheetStoreInterface
} from "../../stores/interfaces";

interface templatesView {
    text: string;
    example: string;
    func: () => void;
    value: string;
}

type TemplateSearchProps = {
    store: NoteStoreInterface | StudySheetStoreInterface;
    toShow: boolean;
};

const TemplateSearch = observer(({ store, toShow }: TemplateSearchProps) => {
    const [searchItem, setSearchItem] = useState("");
    let currentSelected: any = null;

    const handleChange = (el: any, data: DropdownProps) => {
        currentSelected = data.value;
        setSearchItem(data.searchQuery);
    };

    const checkEnter = (ev: any) => {
        if (ev.which === 13) {
            const selected = store.templateSearch.find((item) => {
                return item.value === currentSelected;
            });

            selected.func();
            store.toggleSearch();
            setSearchItem("");
            const el = document.querySelector(".ql-editor") as HTMLElement;
            el.focus();
        }

        if (ev.which === 27) {
            store.toggleSearch();
            const el = document.querySelector(".ql-editor") as HTMLElement;
            el.focus();
        }
    };

    const dropdownOptions = store.templateSearch.map((item) => {
        return {
            key: `${Math.random()}_template`,
            text: item.text,
            value: item.value
        };
    });

    return toShow ? (
        <Dropdown
            placeholder="Enter template name"
            fluid
            selection
            search
            style={{
                position: "absolute",
                left: "50%",
                top: "10%",
                transform: "translate(-50%, -10%)",
                width: "45%"
            }}
            options={dropdownOptions}
            onChange={handleChange}
            noResultsMessage="Template does not exist"
            value="Item Structure Function"
            searchInput={{ autoFocus: true }}
            onSearchChange={(el, val) => setSearchItem(val.searchQuery)}
            searchQuery={searchItem}
            onKeyUp={checkEnter}
        ></Dropdown>
    ) : (
        <h1 style={{ textAlign: "center" }}>Loading...</h1>
    );
});

export default TemplateSearch;

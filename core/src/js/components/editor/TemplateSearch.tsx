import React from "react";
import { observer } from "mobx-react-lite";

import { Dropdown } from "semantic-ui-react";

interface templatesView {
    text: string;
    example: string;
    func: () => void;
    value: string;
}

type TemplateSearchProps = {
    searchItems: templatesView[];
    toShow: boolean;
};

const TemplateSearch = observer(
    ({ searchItems, toShow }: TemplateSearchProps) => {
        const dropdownOptions = searchItems.map((item) => {
            return {
                key: `${Math.random()}_template`,
                text: item.text,
                value: item.value
            };
        });

        const handleChange = (el: React.SyntheticEvent<HTMLElement, Event>) => {
            const target = el.target as HTMLElement;
            const value = target.innerText;

            const selected = searchItems.find((item) => {
                return item.text === value;
            });
            console.log(typeof selected);
            if (selected !== null && typeof selected !== "undefined")
                selected.func();
        };

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
            ></Dropdown>
        ) : (
            <h1 style={{ textAlign: "center" }}>Loading...</h1>
        );
    }
);

export default TemplateSearch;

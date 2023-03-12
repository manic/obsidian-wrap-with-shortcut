import { Modal, Setting } from "obsidian";

import WrapWithShortcut, { WrapperTag } from "./main";

export default class WrapperCreatorModal extends Modal {
	plugin: WrapWithShortcut;
	wrapper: WrapperTag;
	editMode: boolean;

	constructor(plugin: WrapWithShortcut, wrapper?: WrapperTag) {
		super(plugin.app);
		if (wrapper) {
			this.wrapper = wrapper;
			this.editMode = true;
		} else {
			this.wrapper = { name: "", startTag: "", endTag: "" };
			this.editMode = false;
		}
	}

	onOpen() {
		this.display();
	}

	display() {
		const { contentEl: el } = this;
		el.empty();
		this.titleEl.setText(
			this.editMode ? "Edit wrapper" : "Add a new wrapper"
		);

		new Setting(el)
			.setName("Name")
			.setDesc("Specify the Name of your wrapper.")
			.addText((cb) => {
				cb.setValue(this.wrapper.name ?? "")
					.setDisabled(this.editMode)
					.onChange((value) => {
						this.wrapper.name = value.trim();
					});
			});

		new Setting(el)
			.setName("Start Tag")
			.setDesc("Specify the start tag")
			.addTextArea((cb) => {
				cb.setValue(this.wrapper.startTag ?? "").onChange((value) => {
					this.wrapper.startTag = value;
				});
			});

		new Setting(el)
			.setName("End Tag")
			.setDesc("Specify the end tag")
			.addTextArea((cb) => {
				cb.setValue(this.wrapper.endTag ?? "").onChange((value) => {
					this.wrapper.endTag = value;
				});
			});

		const btnDiv = el.createDiv();
		const btn = createEl("button", { text: "Finish" });

		// Align button to right
		btn.style.cssText =
			"display: flex; flex-direction: row; margin-left: auto;";
			
		btnDiv.appendChild(btn);

		btn.addEventListener("click", () => {
			const eventName = this.editMode
				? "M-wrapperEditted"
				: "M-wrapperAdded";
			dispatchEvent(
				new CustomEvent(eventName, {
					detail: this.wrapper,
				})
			);
			this.close();
		});
	}
}

import { Page , Locator } from '@playwright/test';

class UploadComponent{
    page: Page;
    uploadInput: string;
    submitBtn: Locator;
    successMessage: Locator;

    constructor(page: Page){
        this.page = page;
        this.uploadInput = 'input#upfile_1';
        this.submitBtn = page.locator('#upload_1');
        this.successMessage = page.locator('#wfu_messageblock_header_1_1');
    }

    async uploadFile(filePath: string){
        await this.page.setInputFiles(this.uploadInput, filePath);
        await this.submitBtn.click();

    }
}

export default UploadComponent;



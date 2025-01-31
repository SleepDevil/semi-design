/* argus-disable unPkgSensitiveInfo */
import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
// import { withKnobs, text, boolean } from '@storybook/addon-knobs';

import { Upload, Button, Toast, Icon } from '@douyinfe/semi-ui/index';
import { withField, Form } from '../../form/index';
import { IconPlus, IconFile, IconUpload } from '@douyinfe/semi-icons';

import FileCard from '../fileCard';

const stories = storiesOf('Upload', module);

// stories.addDecorator(withKnobs);;

let action = 'https://run.mocky.io/v3/d6ac5c9e-4d39-4309-a747-7ed3b5694859';
// let action = 'https://127.0.0.1:3000/upload/';
// action = 'https://jsonplaceholder.typicode.com/posts/';
let actionFail = 'https://run.mocky.io/v3/d6ac5c9e-4d39-4309-a747-7ed3b5694859';
let apiNotExist = 'https://run.mocky.io/v3/d6ac5c9e-4d39-4309-a747-7ed3b5694859';

let commonProps = {
    action: action,
    onSuccess: (...args) => {
        console.log('onSuccess');
        Toast.success('success');
        console.log(args);
    },
    onProcess: (...args) => {
        console.log('onProcess');
        console.log(args);
    },
    onError: (...args) => {
        Toast.error('onError');
        console.log('onError');
        console.log(args);
    },
    onExceed: (...args) => {
        Toast.warning('onExceed');
        console.log('onExceed');
        console.log(args);
    },
    onSizeError: (...args) => {
        Toast.warning('onSizeError');
        console.log('onSizeError');
        console.log(args);
    },
    onChange: (...args) => {
        console.log('onChange');
        console.log(args);
    },
    onPreviewClick: fileItem => {
        let url = fileItem.url;
        console.log(fileItem);
        window.open(url);
    },
};

stories.add('基本用法', () => (
    <>
        <Upload {...commonProps}>
            <Button icon={<IconUpload />} theme="light">
                点击上传
            </Button>
        </Upload>
        <Upload style={{ marginTop: 20 }} {...commonProps} showReplace>
            <Button icon={<IconUpload />} theme="light">
                点击上传（可替换）
            </Button>
        </Upload>
        <Upload
            style={{ marginTop: 20 }}
            {...commonProps}
            action={actionFail}
            prompt={<div style={{ display: 'flex', alignItems: 'center' }}>一个404的接口</div>}
        >
            <Button icon={<IconUpload />} theme="light">
                upload接口 404
            </Button>
        </Upload>
        <Upload
            style={{ marginTop: 20 }}
            {...commonProps}
            action={'https://semi.dev.com/api/upload503'}
            prompt={<div style={{ display: 'flex', alignItems: 'center' }}>一个503的接口</div>}
        >
            <Button icon={<IconUpload />} theme="light">
                upload接口503
            </Button>
        </Upload>
        <Upload
            style={{ marginTop: 20 }}
            {...commonProps}
            action={apiNotExist}
            prompt={<div style={{ display: 'flex', alignItems: 'center' }}>一个跨域不能请求的接口</div>}
        >
            <Button icon={<IconUpload />} theme="light">
                upload接口跨域了
            </Button>
        </Upload>
    </>
));

let data = {
    role: 'ies',
    time: new Date().getTime(),
};

let headers = {
    'x-tt-semi-test': 'semi-upload',
};

const getPromptDemo = () => {
    const action = '//semi.design/api/upload';
    const getPrompt = (pos, isListType) => {
        let basicStyle = { display: 'flex', alignItems: 'center', color: 'grey', height: isListType ? '100%' : 32 };
        let marginStyle = {
            left: { marginRight: 10 },
            right: { marginLeft: 10 },
        };
        let style = { ...basicStyle, ...marginStyle[pos] };

        return <div style={style}>请上传资格认证材料</div>;
    };
    const button = (
        <Button icon={<IconUpload />} theme="light">
            点击上传
        </Button>
    );
    const positions = ['right', 'left', 'bottom'];
    return (
        <>
            {positions.map((pos, index) => (
                <>
                    {index ? (
                        <div
                            style={{ marginBottom: 12, marginTop: 12, borderBottom: '1px solid var(--semi-color-border)' }}
                        ></div>
                    ) : null}
                    <Upload action={action} prompt={getPrompt(pos)} promptPosition={pos}>
                        {button}
                    </Upload>
                </>
            ))}
            <div style={{ marginBottom: 24, marginTop: 24, borderBottom: '1px solid var(--semi-color-border)' }}></div>
            {positions.map((pos, index) => (
                <>
                    {index ? (
                        <div
                            style={{ marginBottom: 12, marginTop: 12, borderBottom: '1px solid var(--semi-color-border)' }}
                        ></div>
                    ) : null}
                    <Upload
                        action={action}
                        prompt={getPrompt(pos, true)}
                        promptPosition={pos}
                        listType="picture"
                        defaultFileList={defaultFileList}
                    >
                        <React.Fragment>
                            <IconPlus />
                        </React.Fragment>
                    </Upload>
                </>
            ))}
        </>
    );
};

stories.add('prompt提示文本', () => getPromptDemo());

stories.add('自定义data、headers', () => (
    <>
        <h4>直接返回object</h4>
        <Upload {...commonProps} data={data} headers={headers}>
            <Button icon={<IconUpload />} theme="light">
                点击上传
            </Button>
        </Upload>
        <h4>通过函数直接返回object</h4>
        <Upload {...commonProps} data={() => data} headers={() => headers}>
            <Button icon={<IconUpload />} theme="light">
                点击上传
            </Button>
        </Upload>
    </>
));

let imageOnly = 'image/*';
let videoOnly = 'video/*';
stories.add('通过accept限制上传文件类型', () => (
    <>
        <Upload {...commonProps} action={action} accept={imageOnly}>
            <Button icon={<IconUpload />} theme="light">
                点击上传image
            </Button>
        </Upload>
        <br />
        <br />
        <Upload {...commonProps} action={action} accept={videoOnly}>
            <Button icon={<IconUpload />} theme="light">
                点击上传video
            </Button>
        </Upload>
    </>
));

stories.add('允许一次选择多个文件', () => (
    <>
        <Upload {...commonProps} action={action} multiple>
            <Button icon={<IconUpload />} theme="light">
                点击上传
            </Button>
        </Upload>
    </>
));

const defaultFileList = [
    {
        uid: '1',
        name: 'jiafang1.jpeg',
        status: 'success',
        size: '130kb',
        url: 'https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/bf8647bffab13c38772c9ff94bf91a9d.jpg',
    },
    {
        uid: '2',
        name: 'jiafang2.jpeg',
        status: 'uploadFail',
        size: '222kb',
        url: 'https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/bf8647bffab13c38772c9ff94bf91a9d.jpg',
    },
    {
        uid: '5',
        name: 'jiafang3.jpeg',
        status: 'uploading',
        percent: 50,
        size: '222kb',
        url: 'https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/bf8647bffab13c38772c9ff94bf91a9d.jpg',
    },
    {
        uid: '5',
        name: 'jiafang3.jpeg',
        status: 'validateFail',
        validateMessage: '文件过大',
        size: '222kb',
        url: 'https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/bf8647bffab13c38772c9ff94bf91a9d.jpg',
    },
    {
        uid: '4',
        name: 'jiafang4.jpeg',
        status: 'validating',
        validateMessage: '校验中',
        size: '222kb',
        url: 'https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/bf8647bffab13c38772c9ff94bf91a9d.jpg',
    },
];

stories.add('已上传的文件列表-defaultFileList', () => (
    <>
        <Upload {...commonProps} action={action} defaultFileList={defaultFileList}>
            <Button icon={<IconUpload />} theme="light">
                点击上传
            </Button>
        </Upload>
    </>
));

class ControledUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: defaultFileList,
        };
        this.onChange = this.onChange.bind(this);
    }

    onChange({ fileList, currentFile, event }) {
        console.log('onChange');
        console.log(fileList);
        console.log(currentFile);
        this.setState({ fileList: fileList });
    }

    render() {
        return (
            <Upload
                {...commonProps}
                action={action}
                onChange={this.onChange}
                fileList={this.state.fileList}
                showRetry={false}
            >
                <Button icon={<IconUpload />} theme="light">
                    点击上传
                </Button>
            </Upload>
        );
    }
}

stories.add('受控的fileList', () => <ControledUpload></ControledUpload>);

let kb1 = 1024 * 1024;
let kb2 = kb1 * 2;
let mb1 = kb1 * 1024;

stories.add('限制上传文件大小', () => (
    <>
        <Upload
            {...commonProps}
            action={action}
            maxSize={mb1}
            minSize={kb2}
            onSizeError={(file, fileList) => Toast.error(`${file.name} size invalid`)}
        >
            <Button icon={<IconUpload />} theme="light">
                点击上传（最小200kB，最大1MB）
            </Button>
        </Upload>
    </>
));

stories.add('照片墙', () => (
    <>
        <Upload {...commonProps} showReplace action={action} listType="picture" accept="image/*" multiple>
            <React.Fragment>
                <IconPlus size="extra-large" />
            </React.Fragment>
        </Upload>
    </>
));

stories.add('照片墙,带默认文件', () => (
    <>
        <Upload
            showReplace
            {...commonProps}
            action={action}
            listType="picture"
            accept="image/*"
            defaultFileList={defaultFileList}
        >
            <React.Fragment>
                <IconPlus size="extra-large" />
            </React.Fragment>
        </Upload>
    </>
));

class ManulUploadDemo extends React.Component {
    constructor() {
        super();
        this.state = {
            fileList: [],
        };
        this.onFileChange = this.onFileChange.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.manulUpload = this.manulUpload.bind(this);
        this.uploadRef = React.createRef();
    }

    onFileChange(file) {
        let newFileList = [...this.state.fileList, ...file];
        this.setState({ fileList: newFileList });
    }

    onRemove(file) {
        let { fileList } = this.state;
        fileList.filter(item => item.uid !== file.uid);
        this.setState({ fileList });
    }

    manulUpload() {
        this.uploadRef.current.upload(this.state.fileList);
    }

    render() {
        const { fileList } = this.state;
        return (
            <div>
                <Upload
                    {...commonProps}
                    accept="image/gif, image/png, image/jpeg, image/bmp, image/webp"
                    action={action}
                    uploadTrigger="custom"
                    ref={this.uploadRef}
                    onSuccess={(...v) => console.log(...v)}
                    onError={(...v) => console.log(...v)}
                >
                    <Button icon={<IconPlus />} theme="light">
                        选择文件
                    </Button>
                </Upload>
                <Button icon={<IconUpload />} theme="light" onClick={this.manulUpload}>
                    开始上传
                </Button>
            </div>
        );
    }
}

stories.add('手动上传', () => <ManulUploadDemo />);

stories.add('禁用', () => (
    <>
        <Upload {...commonProps} action={action} disabled defaultFileList={defaultFileList}>
            <Button icon={<IconUpload />} theme="light" disabled>
                点击上传
            </Button>
        </Upload>
    </>
));

stories.add('自定义预览', () => (
    <>
        <Upload {...commonProps} action={action} previewFile={file => <IconFile size="large" />}>
            <Button icon={<IconUpload />} theme="light">
                点击上传
            </Button>
        </Upload>
    </>
));

const CustomRenderFileDemo = () => {
    const render = file => {
        return <div style={{ padding: 8, width: 80, height: 32 }}>{file.name}</div>;
    };
    return (
        <>
            <h5>renderFileItem demo：</h5>
            <Upload {...commonProps} action={action} renderFileItem={render}>
                <Button icon={<IconUpload />} theme="light">
                    点击上传
                </Button>
            </Upload>
            <h5>itemWidth demo：</h5>
            <Upload {...commonProps} action={action} itemStyle={{ width: 150 }} style={{ width: 500 }} multiple>
                <Button icon={<IconUpload />} theme="light">
                    点击上传
                </Button>
            </Upload>
        </>
    );
};

stories.add('renderFileItem', () => <CustomRenderFileDemo />);

stories.add('根据limit设置上传文件数量', () => (
    <>
        <Upload
            {...commonProps}
            action={action}
            limit={1}
            uploadTrigger="custom"
            onExceed={() => Toast.error('超出限定数量')}
        >
            <Button icon={<IconUpload />} theme="light">
                点击上传, uploadtrigger = custom
            </Button>
        </Upload>
        <Upload {...commonProps} action={action} limit={1} onExceed={() => Toast.error('超出限定数量')}>
            <Button icon={<IconUpload />} theme="light">
                点击上传1
            </Button>
        </Upload>
        <Upload {...commonProps} action={action} limit={2} onExceed={() => Toast.error('超出限定数量')}>
            <Button icon={<IconUpload />} theme="light">
                点击上传2
            </Button>
        </Upload>
    </>
));

stories.add('拖拽上传', () => (
    <>
        <Upload
            {...commonProps}
            draggable={true}
            disabled
            accept="application/pdf,.jpeg"
            dragMainText={'点击上传文件或拖拽文件到这里'}
            dragSubText="支持的文件类型：.jpg、.pdf"
        ></Upload>

        <Upload
            {...commonProps}
            style={{ marginTop: 10, height: 300 }}
            draggable={true}
            dragMainText={'点击上传文件或拖拽文件到这里'}
        ></Upload>

        <Upload style={{ marginTop: 10, height: 300 }} action={action} draggable={true}>
            <div>
                <IconUpload size="extra-large" />
                自定义拖拽取内容及结构
            </div>
        </Upload>
    </>
));

stories.add('FileCard', () => (
    <>
        <FileCard name="semi" suffix="jpg" percent={50} showRetry onRetry={v => console.log(v)}></FileCard>
        <FileCard
            name="invalid"
            suffix="jpg"
            size={12321}
            validateStatus="error"
            showRetry
            onRetry={v => console.log(v)}
        ></FileCard>
        <FileCard name="semi.jpg" percent={50} size={10022}></FileCard>
    </>
));

class ValidateDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.beforeUpload = this.beforeUpload.bind(this);
        this.afterUpload = this.afterUpload.bind(this);
        this.transformFile = this.transformFile.bind(this);
        this.count = 0;
    }
    transformFile(fileInstance) {
        if (this.count === 0) {
            let newFile = new File([fileInstance], 'newFileName', { type: 'image/png' });
            return newFile;
        } else {
            return fileInstance;
        }
    }

    afterUpload({ response, file }) {
        // 可以根据业务接口返回，决定当次上传是否成功
        if (response.status_code == 200) {
            return {
                autoRemove: false,
                status: 'uploadFail',
                validateMessage: '内容不合法',
                name: 'RenameByServer.jpg',
            };
        } else {
            return {};
        }
    }
    beforeUpload({ file, fileList }) {
        let result;
        if (this.count > 1) {
            result = {
                autoRemove: false,
                fileInstance: file.fileInstance,
                shouldUpload: true,
            };
        } else {
            result = {
                autoRemove: false,
                fileInstance: file.fileInstance,
                status: 'validateFail',
                shouldUpload: false,
            };
        }
        this.count = this.count + 1;
        return result;
    }

    render() {
        return (
            <Upload
                {...commonProps}
                action={action}
                transformFile={this.transformFile}
                // beforeUpload={this.beforeUpload}
                afterUpload={this.afterUpload}
            >
                <Button icon={<IconUpload />} theme="light">
                    点击上传
                </Button>
            </Upload>
        );
    }
}

stories.add('transformFile / beforeUpload / afterUpload 组合使用', () => <ValidateDemo />);

class AsyncBeforeUploadDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.beforeUpload = this.beforeUpload.bind(this);
        this.count = 0;
    }

    beforeUpload({ file, fileList }) {
        let result;
        return new Promise((reslove, reject) => {
            if (this.count > 1) {
                result = {
                    autoRemove: false,
                    shouldUpload: true,
                };
                this.count = this.count + 1;
                reslove(result);
            } else {
                result = {
                    autoRemove: false,
                    fileInstance: file.fileInstance,
                    status: 'validateFail',
                    shouldUpload: false,
                    validateMessage: `第${this.count + 1}个注定失败`,
                };
                this.count = this.count + 1;
                reject(result);
            }
        });
    }

    render() {
        return (
            <Upload {...commonProps} action={action} beforeUpload={this.beforeUpload}>
                <Button icon={<IconUpload />} theme="light">
                    点击上传
                </Button>
            </Upload>
        );
    }
}

stories.add('async beforeUpload', () => <AsyncBeforeUploadDemo />);

class ValidateMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        // this.transformFile = this.transformFile.bind(this);
    }

    render() {
        return (
            <Upload {...commonProps} action={action}>
                <Button icon={<IconUpload />} theme="light">
                    点击上传
                </Button>
            </Upload>
        );
    }
}
stories.add('Upload validateMessage validageStatus', () => <ValidateMessage />);

class FormUploadDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        // this.transformFile = this.transformFile.bind(this);
    }

    render() {
        return (
            <Form labelPosition="left">
                {({ formState }) => (
                    <>
                        <Form.Upload
                            {...commonProps}
                            action={action}
                            field="files"
                            label="认证图片上传"
                            extraText="请上传符合规格的图片"
                            name="testName"
                            uploadTrigger="custom"
                            onChange={({ fileList, currentFile }) => {
                                console.log(fileList);
                            }}
                        >
                            <Button icon={<IconUpload />} theme="light">
                                点击上传
                            </Button>
                        </Form.Upload>
                        <code>{JSON.stringify(formState)}</code>
                    </>
                )}
            </Form>
        );
    }
}

stories.add('Form.Upload', () => <FormUploadDemo />);

class CustomRequestDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        // this.transformFile = this.transformFile.bind(this);
        // this.tosClient =
    }

    render() {
        return (
            <Form labelPosition="left">
                {({ formState }) => (
                    <>
                        <Form.Upload
                            {...commonProps}
                            action={action}
                            customRequest={({ onProgress, onSuccess, onError }) => {
                                let count = 0;
                                onError();
                                // let interval = setInterval(() => {
                                //     if (count === 100) {
                                //         clearInterval(interval);
                                //         onSuccess();
                                //     }
                                //     onProgress({ total: 100, loaded: count });
                                //     count += 50;
                                // }, 1000);
                            }}
                            field="files"
                            label="认证图片上传"
                            extraText="请上传符合规格的图片"
                            name="testName"
                        >
                            <Button icon={<IconUpload />} theme="light">
                                点击上传
                            </Button>
                        </Form.Upload>
                    </>
                )}
            </Form>
        );
    }
}

stories.add('Form.CustomRequest', () => <CustomRequestDemo />);

class AutoReplace extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Upload {...commonProps} action={action} limit={1} name="testName">
                <Button icon={<IconUpload />} theme="light">
                    点击上传
                </Button>
            </Upload>
        );
    }
}

stories.add('AutoReplace limit=1', () => <AutoReplace />);

function DirectoryUpload() {
    return (
        <>
            <Upload {...commonProps} directory>
                <Button icon={<IconUpload />} theme="light">
                    点击上传文件夹
                </Button>
            </Upload>
            <Upload {...commonProps} directory accept="image/png">
                <Button icon={<IconUpload />} theme="light">
                    点击上传文件夹并指定图片格式
                </Button>
            </Upload>
            <Upload
                {...commonProps}
                style={{ marginTop: 10, height: 300 }}
                accept="image/png"
                draggable={true}
                dragMainText={'拖拽文件夹上传'}
                onDrop={console.log}
                directory
            ></Upload>
        </>
    );
}

stories.add('文件夹上传', () => <DirectoryUpload />);

function ForbiddenRemove() {
    const [fileList, $fileList] = useState(defaultFileList);
    return (
        <>
            <Upload
                fileList={fileList}
                onChange={f => {
                    $fileList(f.fileList);
                }}
                beforeRemove={(file, currentList) => currentList.length > 2}
                beforeClear={list => list.length > 2}
            >
                <Button icon={<IconUpload />} theme="light">
                    点击上传
                </Button>
            </Upload>
        </>
    );
}

stories.add('阻止移除', () => <ForbiddenRemove />);

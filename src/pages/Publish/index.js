import { Card, Breadcrumb, Form, Button, Radio, Input, Upload, Space, Select, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import './index.scss'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useState } from 'react'
import { createArticleAPI } from '@/apis/article'
import { useChannel } from '../hooks/useChannel'

const { Option } = Select

const Publish = () => {
  const { channelList } = useChannel()

  const onFinish = async (formValue) => {
    if (imageList.length !== imageType) return message.warning('图片数量不对')
    const { channel_id, content, title } = formValue
    const params = {
      channel_id,
      content,
      title,
      type: 1,
      cover: {
        type: imageType,
        images: imageList.map((item) => item.response.data.url)
      }
    }
    await createArticleAPI(params)
  }

  const [imageList, setImageList] = useState([])
  const onUploadChange = (info) => {
    setImageList(info.fileList)
  }

  const [imageType, setImageType] = useState(1)
  const onTypeChange = (e) => {
    setImageType(e.target.value)
  }
  return (
    <div className="publish">
      <Card title={<Breadcrumb items={[{ title: <Link to={'/'}>首页</Link> }, { title: '发布文章' }]} />}>
        <Form onFinish={onFinish} labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} initialValues={{ type: imageType }}>
          <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入文章标题' }]}>
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item label="频道" name="channel_id" rules={[{ required: true, message: '请选择文章频道' }]}>
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              {channelList.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={onTypeChange}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {imageType > 0 && (
              <Upload name="image" maxCount={imageType} listType="picture-card" showUploadList action={'http://geek.itheima.net/v1_0/upload'} onChange={onUploadChange}>
                <div style={{ marginTop: 8 }}>
                  <PlusOutlined />
                </div>
              </Upload>
            )}
          </Form.Item>
          <Form.Item label="内容" name="content" rules={[{ required: true, message: '请输入文章内容' }]}>
            <ReactQuill className="publish-quill" theme="snow" placeholder="请输入文章内容" />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                发布文章
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Publish

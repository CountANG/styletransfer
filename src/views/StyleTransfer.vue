<template>
  <div>
    <div class="align-center">
      <el-select
        v-model="selectedStyle"
        placeholder="Select"
        size="large"
        style="width: 240px"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-upload
        ref="upload"
        :file-list="fileList"
        @change="handleChange"
        action="http://127.0.0.1:6006/upload"
        :auto-upload="false"
        :limit="1"
      >
        <el-button size="small" type="primary">选取文件</el-button>
      </el-upload>
      <el-button
        style="margin-left: 10px"
        size="small"
        type="success"
        @click="submitUpload"
        >上传到服务器
      </el-button>
    </div>
    <div v-if="resultImage" style="display: flex">
      <div>
        <h3>原图像：</h3>
        <img
          :src="uploadedImageUrl"
          alt="Uploaded Image"
          style="max-width: 256px; max-height: 256px; display: inline-block"
        />
      </div>
      <div>
        <h3>风格迁移后的图像：</h3>
        <img
          :src="resultImage"
          alt="Result Image"
          style="max-width: 256px; max-height: 256px; display: inline-block"
        />
      </div>
    </div>

    <div style="max-width: 256px; max-height: 256px" v-show="resultImage">
      <div id="image-compare">
        <img :src="uploadedImageUrl" alt="" />
        <img :src="resultImage" alt="" />
      </div>
    </div>
  </div>
</template>
<style>
@import "/Users/countang/Desktop/FrontEnd/styletransfer/node_modules/image-compare-viewer/dist/image-compare-viewer.min.css";

#image-compare {
  width: 100%;
}

.align-center {
  width: 100%;
  height: 4rem;
  display: flex;
  align-items: center;
}
</style>

<script>
import ImageCompare from "image-compare-viewer";

export default {
  mounted() {
    const element = document.getElementById("image-compare");
    this.viewer = new ImageCompare(element);

    // mount()方法用于显示图片比较器
    this.viewer.mount();
  },
  data() {
    return {
      fileList: [],
      resultImage: null,
      uploadedImageUrl: null,
      selectedStyle: "ink_normal",
      options: [
        { label: "水墨画风格(原版)", value: "ink_normal" },
        { label: "水墨画风格(VGG)", value: "ink_vgg" },
        { label: "水墨画风格(注意力+VGG)", value: "ink_attention_vgg" },
        { label: "莫奈风格", value: "monet" },
      ],
    };
  },
  methods: {
    handleChange(file, fileList) {
      // 更新文件列表
      this.fileList = fileList;
      // 手动清空文件列表
      this.$refs.upload.clearFiles();
    },
    handleSuccess(response) {
      console.log("Response:", response);
      this.resultImage = response.data.url;
      this.uploadedImageUrl = response.data.uploaded_url;
      this.$forceUpdate();
    },
    handleError(error) {
      console.error(error);
    },
    submitUpload() {
      if (this.fileList.length > 0) {
        let formData = new FormData();
        // 只取第一个文件，如果需要多文件，则需要遍历fileList
        formData.append("file", this.fileList[0].raw);
        formData.append("selectedStyle", this.selectedStyle);
        this.fileList = [];
        // 使用axios发送post请求
        this.$http
          .post("http://127.0.0.1:6006/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            // this.resultImage = response.url;
            this.handleSuccess(response);
          })
          .catch((error) => {
            this.handleError(error);
          });
      } else {
        // 文件列表为空的错误处理
        console.error("No files to upload.");
      }
    },
  },
};
</script>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  MomoButton,
  MomoCheckbox,
  MomoCheckboxGroup,
  MomoDatePicker,
  MomoForm,
  MomoFormItem,
  MomoInput,
  MomoInputNumber,
  MomoMessage,
  MomoRadio,
  MomoRadioGroup,
  MomoRate,
  MomoSelect,
  MomoSlider,
  MomoSwitch,
  type FormRule,
} from '../../src'

const formRef = ref<InstanceType<typeof MomoForm> | null>(null)

const model = reactive({
  name: '',
  age: 18,
  city: '',
  gender: 'male',
  tags: ['vue'],
  notify: true,
  rating: 4,
  score: 60,
  birthday: '',
})

const rules: Record<string, FormRule[]> = {
  name: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 12, message: '昵称需要 2 ~ 12 个字符', trigger: 'blur' },
  ],
  age: [{ required: true, message: '请输入年龄', trigger: 'change' }],
  city: [{ required: true, message: '请选择所在城市', trigger: 'change' }],
  birthday: [{ required: true, message: '请选择生日', trigger: 'change' }],
}

const cityOptions = [
  { label: '上海', value: 'shanghai' },
  { label: '北京', value: 'beijing' },
  { label: '杭州', value: 'hangzhou' },
  { label: '深圳', value: 'shenzhen' },
]

const city = ref('')
const birthday = ref('')

async function handleSubmit() {
  const valid = await formRef.value?.validate()
  if (valid) {
    MomoMessage.success('校验通过，提交成功 🎉')
  } else {
    MomoMessage.error('还有内容没填好哦')
  }
}

function handleReset() {
  formRef.value?.resetFields()
}
</script>

<template>
  <div>
    <section class="demo-section">
      <h2 class="demo-section__title">输入框 / 数字 / 选择</h2>

      <div class="demo-flex">
        <div class="demo-block demo-narrow">
          <span class="demo-label">Input</span>
          <MomoInput v-model="model.name" placeholder="请输入昵称" clearable />
        </div>

        <div class="demo-block demo-narrow">
          <span class="demo-label">带图标 & 密码</span>
          <MomoInput
            v-model="city"
            placeholder="搜索点什么"
            prefix-icon="search"
            clearable
            show-word-limit
            :maxlength="20"
          />
        </div>

        <div class="demo-block demo-narrow">
          <span class="demo-label">InputNumber</span>
          <MomoInputNumber v-model="model.age" :min="0" :max="120" />
        </div>

        <div class="demo-block demo-narrow">
          <span class="demo-label">Select</span>
          <MomoSelect
            v-model="model.city"
            :options="cityOptions"
            placeholder="选择城市"
            clearable
            filterable
          />
        </div>

        <div class="demo-block demo-narrow">
          <span class="demo-label">DatePicker</span>
          <MomoDatePicker v-model="birthday" placeholder="选择日期" />
        </div>
      </div>

      <div class="demo-block demo-narrow">
        <span class="demo-label">Textarea</span>
        <MomoInput
          type="textarea"
          :rows="3"
          placeholder="说点什么…"
          show-word-limit
          :maxlength="120"
        />
      </div>
    </section>

    <section class="demo-section">
      <h2 class="demo-section__title">选择控件</h2>

      <div class="demo-block">
        <span class="demo-label">RadioGroup</span>
        <MomoRadioGroup v-model="model.gender">
          <MomoRadio value="male" label="小哥哥" />
          <MomoRadio value="female" label="小姐姐" />
          <MomoRadio value="other" label="保密" />
        </MomoRadioGroup>
      </div>

      <div class="demo-block">
        <span class="demo-label">CheckboxGroup</span>
        <MomoCheckboxGroup v-model="model.tags">
          <MomoCheckbox value="vue" label="Vue" />
          <MomoCheckbox value="react" label="React" />
          <MomoCheckbox value="ts" label="TypeScript" />
          <MomoCheckbox value="css" label="CSS" />
        </MomoCheckboxGroup>
      </div>

      <div class="demo-block">
        <span class="demo-label">Switch</span>
        <MomoSwitch
          v-model="model.notify"
          active-text="开启通知"
          inactive-text="关闭通知"
        />
      </div>

      <div class="demo-block demo-narrow">
        <span class="demo-label">Slider</span>
        <MomoSlider v-model="model.score" :min="0" :max="100" />
      </div>

      <div class="demo-block">
        <span class="demo-label">Rate</span>
        <MomoRate v-model="model.rating" show-text />
      </div>
    </section>

    <section class="demo-section">
      <h2 class="demo-section__title">表单校验 Form</h2>

      <MomoForm
        ref="formRef"
        :model="model"
        :rules="rules"
        label-width="86px"
        scroll-to-error
        @submit="handleSubmit"
      >
        <MomoFormItem label="昵称" prop="name">
          <MomoInput v-model="model.name" placeholder="2 ~ 12 个字符" clearable />
        </MomoFormItem>

        <MomoFormItem label="年龄" prop="age">
          <MomoInputNumber v-model="model.age" :min="1" :max="120" />
        </MomoFormItem>

        <MomoFormItem label="城市" prop="city">
          <MomoSelect
            v-model="model.city"
            :options="cityOptions"
            placeholder="请选择城市"
          />
        </MomoFormItem>

        <MomoFormItem label="生日" prop="birthday">
          <MomoDatePicker v-model="model.birthday" placeholder="请选择生日" />
        </MomoFormItem>

        <MomoFormItem label="爱好">
          <MomoCheckboxGroup v-model="model.tags">
            <MomoCheckbox value="vue" label="Vue" />
            <MomoCheckbox value="ts" label="TypeScript" />
            <MomoCheckbox value="design" label="Design" />
          </MomoCheckboxGroup>
        </MomoFormItem>

        <MomoFormItem label="评分">
          <MomoRate v-model="model.rating" />
        </MomoFormItem>

        <MomoFormItem>
          <div class="demo-row" style="margin: 0">
            <MomoButton type="primary" native-type="submit">提交表单</MomoButton>
            <MomoButton native-type="reset" @click="handleReset">重置</MomoButton>
          </div>
        </MomoFormItem>
      </MomoForm>
    </section>
  </div>
</template>

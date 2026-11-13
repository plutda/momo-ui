import { withInstall } from '../../utils/install'
import Upload from './upload.vue'

export const MomoUpload = withInstall(Upload)
export default MomoUpload
export type {
  UploadProps,
  UploadFile,
  UploadStatus,
  UploadRequestOptions,
} from './upload.vue'

export const BaseUrl = '';
export const ImageUrlPrefix = `${BaseUrl}/image_server/image_server/image?path=`;
/**
 * 常用方法封装 请求，文件上传等
 * @author echo.
 **/

interface RequestType {
  method: 'GET' | 'POST';
  prefix: string;
  data: Record<string, unknown>;
  isDelay?: boolean;
  isForm?: boolean;
  hideLoading?: boolean;
}

let delayed = 0;

const request = (
  url: string,
  { method, prefix, data, isDelay, isForm, hideLoading }: RequestType
) => {
  //接口请求
  let loadding = false;
  delayed && uni.hideLoading();
  clearTimeout(delayed);
  delayed = 0;
  if (!hideLoading) {
    delayed = setTimeout(
      () => {
        uni.showLoading({
          mask: true,
          title: '请稍候...',
          success(res) {
            loadding = true;
          }
        });
      },
      isDelay ? 1000 : 0
    );
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: (prefix || BaseUrl) + url,
      data,
      header: {
        'content-type': isForm ? 'application/x-www-form-urlencoded' : 'application/json',
        Authorization: uni.getStorageSync('token')
      },
      method, //'GET','POST'
      dataType: 'json',
      success: (res: Record<string, any>) => {
        clearTimeout(delayed);
        delayed = 0;
        if (loadding && !hideLoading) {
          uni.hideLoading();
        }
        // if (res.data && res.data.code == 1) {
        // 	uni.clearStorageSync()
        // 	tui.modal("登录信息已失效，请重新登录", false, () => {
        // 		//store.commit("logout") 登录页面执行
        // 		uni.redirectTo({
        // 			url: '/pages/common/login/login'
        // 		})
        // 	})
        // 	return
        // }
        if (res.data.code === 0 || res.data.code === 200) {
          resolve(res.data.data);
        } else {
          // tui.toast(res.data.message);
          new Error(res.data.message);
        }
      },
      fail: (res) => {
        clearTimeout(delayed);
        delayed = 0;
        // tui.toast('网络不给力，请稍后再试~');
        reject(res);
      }
    });
  });
};

export default request;

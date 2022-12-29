import { ILoadingScreen } from "@babylonjs/core";

type Options = {
  backgroundColor?: string;
  text?: string;
  loaderApi: {
    show: () => void | Promise<void>;
    hide: () => void | Promise<void>;
  };
};

const defaultOptions = {
  backgroundColor: "#f0f0f0",
  text: "LOADING",
  loaderApi: {
    show: () => {},
    hide: () => {},
  },
};

export class CustomLoadingScreen implements ILoadingScreen {
  loadingUIBackgroundColor: string;
  loadingUIText: string;
  loader: Options["loaderApi"];

  constructor(options: Options) {
    this.loadingUIBackgroundColor =
      options.backgroundColor || defaultOptions.backgroundColor;
    this.loadingUIText = options.text || defaultOptions.text;
    this.loader = options.loaderApi || defaultOptions.loaderApi;
  }

  displayLoadingUI = () => {
    this.loader.show();
  };

  hideLoadingUI = () => {
    this.loader.hide();
  };
}

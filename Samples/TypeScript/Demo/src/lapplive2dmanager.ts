/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { Live2DCubismFramework as cubismmatrix44 } from '@framework/math/cubismmatrix44';
import { Live2DCubismFramework as csmvector } from '@framework/type/csmvector';
import { Live2DCubismFramework as acubismmotion } from '@framework/motion/acubismmotion';
import Csm_csmVector = csmvector.csmVector;
import Csm_CubismMatrix44 = cubismmatrix44.CubismMatrix44;
import ACubismMotion = acubismmotion.ACubismMotion;

import { LAppModel } from './lappmodel';
import { LAppPal } from './lapppal';
import { canvas } from './lappdelegate';
import * as LAppDefine from './lappdefine';

export let s_instance: LAppLive2DManager = null; //实例化，调用lappmodel.ts的表情、动作方法，参数由LAppDefine.js传输
let teaching_state :boolean = true;
export let changeAtion : HTMLButtonElement = null;
var actionNo = 0;
/**
 * サンプルアプリケーションにおいてCubismModelを管理するクラス
 * モデル生成と破棄、タップイベントの処理、モデル切り替えを行う。
 */
export class LAppLive2DManager {
  /**
   * クラスのインスタンス（シングルトン）を返す。
   * インスタンスが生成されていない場合は内部でインスタンスを生成する。
   *
   * @return クラスのインスタンス
   */
  public static getInstance(): LAppLive2DManager {
    if (s_instance == null) {
      s_instance = new LAppLive2DManager();
    }
    changeAtion = <HTMLButtonElement>document.getElementsByClassName("action_change")[0]
    changeAtion.onmousedown = (): void =>{ //工具栏ation点击事件：增加1
      actionNo ++;
      if(actionNo == 26){
        actionNo = 0;
      }
      console.log("actionNo: "+actionNo)
    };
    return s_instance;
  }

  /**
   * クラスのインスタンス（シングルトン）を解放する。
   */
  public static releaseInstance(): void {
    if (s_instance != null) {
      s_instance = void 0;
    }

    s_instance = null;
  }

  /**
   * 現在のシーンで保持しているモデルを返す。
   *
   * @param no モデルリストのインデックス値
   * @return モデルのインスタンスを返す。インデックス値が範囲外の場合はNULLを返す。
   */
  public getModel(no: number): LAppModel {
    if (no < this._models.getSize()) {
      return this._models.at(no);
    }

    return null;
  }

  /**
   * 現在のシーンで保持しているすべてのモデルを解放する
   */
  public releaseAllModel(): void {
    for (let i = 0; i < this._models.getSize(); i++) {
      this._models.at(i).release();
      this._models.set(i, null);
    }

    this._models.clear();
  }

  /**
   * 画面をドラッグした時の処理
   *
   * @param x 画面のX座標
   * @param y 画面のY座標
   */
  public onDrag(x: number, y: number): void {
    for (let i = 0; i < this._models.getSize(); i++) {
      const model: LAppModel = this.getModel(i);

      if (model) {
        model.setDragging(x, y);
      }
    }
  }

  /**
   * 画面をタップした時の処理 点击事件的处理
   *
   * @param x 画面のX座標
   * @param y 画面のY座標
   */
  public onTap(x: number, y: number): void {
    if (LAppDefine.DebugLogEnable) {
      LAppPal.printMessage(
        `[APP]tap point: {x: ${x.toFixed(2)} y: ${y.toFixed(2)}}` //点击任意点
      );
    }
    this.onTeaching();
    for (let i = 0; i < this._models.getSize(); i++) {
      if (this._models.at(i).hitTest(LAppDefine.HitAreaNameHead, x, y)) { //点击头部
        if (LAppDefine.DebugLogEnable) {
          LAppPal.printMessage(
            `[APP]hit area: [${LAppDefine.HitAreaNameHead}]`
          );
        }
        //this._models.at(i).setRandomExpression(); 
        //this._models.at(i).setExpressionBySize(6);
        this._models.at(i).setExpression('f06');
      } else if (this._models.at(i).hitTest(LAppDefine.HitAreaNameBody, x, y)) { //点击身体
        if (LAppDefine.DebugLogEnable) {
          LAppPal.printMessage(
            `[APP]hit area: [${LAppDefine.HitAreaNameBody}]`
          );
        }
        //this._models.at(i).startRandomMotion(LAppDefine.MotionGroupTapBody,LAppDefine.PriorityNormal,this._finishedMotion);
        this._models.at(i).startRandomMotion(LAppDefine.MotionGroupTeaching,2,this._finishedMotion);
      }
    }
  }

  /**
   * 新建事件，是由设置传输的来决定
   * 教学动作
   */
  public onTeaching() : void{
    if (teaching_state){
      console.log("当前处于教学动作");
      for (let i = 0; i < this._models.getSize(); i++) {           
        //动作 mp3 表情
        //this._models.at(i).startMotionBySize(LAppDefine.MotionGroupTeaching,actionNo,2,this._finishedMotion);
        setTimeout(()=>{
          this._models.at(i).startMotionBySize(LAppDefine.MotionGroupTeaching,5,2,this._finishedMotion);
        },1000)
        setTimeout(()=>{
          this._models.at(i).startMotionBySize(LAppDefine.MotionGroupTeaching,6,2,this._finishedMotion);
        },8000)

        setTimeout(()=>{
          this._models.at(i).startMotionBySize(LAppDefine.MotionGroupTeaching,11,2,this._finishedMotion);
        },13000)
        /** 
        setTimeout(()=>{
          this._models.at(i).startMotionBySize(LAppDefine.MotionGroupTeaching,0,2,this._finishedMotion);
        },1000)
        setTimeout(()=>{
          this._models.at(i).startMotionBySize(LAppDefine.MotionGroupTeaching,1,2,this._finishedMotion);
        },8000)
        setTimeout(()=>{
          this._models.at(i).startMotionBySize(LAppDefine.MotionGroupTeaching,2,2,this._finishedMotion);
        },15000)
        setTimeout(()=>{
          this._models.at(i).startMotionBySize(LAppDefine.MotionGroupTeaching,3,2,this._finishedMotion);
        },20000)
        setTimeout(()=>{
          this._models.at(i).startMotionBySize(LAppDefine.MotionGroupTeaching,4,2,this._finishedMotion);
        },25000)
        setTimeout(()=>{
          this._models.at(i).startMotionBySize(LAppDefine.MotionGroupTeaching,5,2,this._finishedMotion);
        },30000)
        setTimeout(()=>{
          this._models.at(i).startMotionBySize(LAppDefine.MotionGroupTeaching,6,2,this._finishedMotion);
        },35000)
        setTimeout(()=>{
          this._models.at(i).startMotionBySize(LAppDefine.MotionGroupTeaching,7,2,this._finishedMotion);
        },40000)

        setTimeout(()=>{
          this._models.at(i).startMotionBySize(LAppDefine.MotionGroupTeaching,16,2,this._finishedMotion);
        },45000)
        setTimeout(()=>{
          this._models.at(i).startMotionBySize(LAppDefine.MotionGroupTeaching,17,2,this._finishedMotion);
        },50000)

        setTimeout(()=>{
          this._models.at(i).startMotionBySize(LAppDefine.MotionGroupTeaching,18,2,this._finishedMotion);
        },55000)
        setTimeout(()=>{
          this._models.at(i).startMotionBySize(LAppDefine.MotionGroupTeaching,19,2,this._finishedMotion);
        },60000)
        setTimeout(()=>{
          this._models.at(i).startMotionBySize(LAppDefine.MotionGroupTeaching,20,2,this._finishedMotion);
        },65000)
        setTimeout(()=>{
          this._models.at(i).startMotionBySize(LAppDefine.MotionGroupTeaching,21,2,this._finishedMotion);
        },70000)
        setTimeout(()=>{
          this._models.at(i).startMotionBySize(LAppDefine.MotionGroupTeaching,22,2,this._finishedMotion);
        },75000)
        setTimeout(()=>{
          this._models.at(i).startMotionBySize(LAppDefine.MotionGroupTeaching,23,2,this._finishedMotion);
        },80000)
        setTimeout(()=>{
          this._models.at(i).startMotionBySize(LAppDefine.MotionGroupTeaching,24,2,this._finishedMotion);
        },85000)
        setTimeout(()=>{
          this._models.at(i).startMotionBySize(LAppDefine.MotionGroupTeaching,25,2,this._finishedMotion);
        },90000)

        setTimeout(()=>{
          this._models.at(i).startMotionBySize(LAppDefine.MotionGroupTeaching,8,2,this._finishedMotion);
        },95000)
        setTimeout(()=>{
          this._models.at(i).startMotionBySize(LAppDefine.MotionGroupTeaching,9,2,this._finishedMotion);
        },100000)
        setTimeout(()=>{
          this._models.at(i).startMotionBySize(LAppDefine.MotionGroupTeaching,10,2,this._finishedMotion);
        },105000)
        setTimeout(()=>{
          this._models.at(i).startMotionBySize(LAppDefine.MotionGroupTeaching,11,2,this._finishedMotion);
        },110000)
        setTimeout(()=>{
          this._models.at(i).startMotionBySize(LAppDefine.MotionGroupTeaching,12,2,this._finishedMotion);
        },115000)
        setTimeout(()=>{
          this._models.at(i).startMotionBySize(LAppDefine.MotionGroupTeaching,13,2,this._finishedMotion);
        },120000)
        setTimeout(()=>{
          this._models.at(i).startMotionBySize(LAppDefine.MotionGroupTeaching,14,2,this._finishedMotion);
        },125000)
        setTimeout(()=>{
          this._models.at(i).startMotionBySize(LAppDefine.MotionGroupTeaching,15,2,this._finishedMotion);
        },130000)
        */
        this._models.at(i).startSound(LAppDefine.MotionGroupTeaching,1);
        this._models.at(i).setExpressionBySize(5);
        //对动作的调用方法增加一个判断当前是否有动作才能继续执行
        //
      }
    }else{
      console.log("当前不是教学动作");
    }
  }

  /**
   * 画面を更新するときの処理
   * モデルの更新処理及び描画処理を行う
   */
  public onUpdate(): void {
    let projection: Csm_CubismMatrix44 = new Csm_CubismMatrix44();

    const { width, height } = canvas;
    projection.scale(1.0, width / height);

    if (this._viewMatrix != null) {
      projection.multiplyByMatrix(this._viewMatrix);
    }

    const saveProjection: Csm_CubismMatrix44 = projection.clone();
    const modelCount: number = this._models.getSize();

    for (let i = 0; i < modelCount; ++i) {
      const model: LAppModel = this.getModel(i);
      projection = saveProjection.clone();

      model.update();
      model.draw(projection); // 参照渡しなのでprojectionは変質する。
    }
  }

  /**
   * 次のシーンに切りかえる
   * サンプルアプリケーションではモデルセットの切り替えを行う。
   */
  public nextScene(): void {
    const no: number = (this._sceneIndex + 1) % LAppDefine.ModelDirSize;
    this.changeScene(no);
  }

  /**
   * シーンを切り替える
   * サンプルアプリケーションではモデルセットの切り替えを行う。
   */
  public changeScene(index: number): void {
    this._sceneIndex = index;
    if (LAppDefine.DebugLogEnable) {
      LAppPal.printMessage(`[APP]model name: ${this._sceneIndex+LAppDefine.ModelDir[index]}`);
    }

    // ModelDir[]に保持したディレクトリ名から
    // model3.jsonのパスを決定する。
    // ディレクトリ名とmodel3.jsonの名前を一致させておくこと。
    const model: string = LAppDefine.ModelDir[index];
    const modelPath: string = LAppDefine.ResourcesPath + model + '/';
    let modelJsonName: string = LAppDefine.ModelDir[index];
    modelJsonName += '.model3.json'; //拼接生成模型路径

    this.releaseAllModel(); //清除原来显示的模型
    this._models.pushBack(new LAppModel());
    this._models.at(0).loadAssets(modelPath, modelJsonName);
  }

  /**
   * コンストラクタ 构造器
   */
  constructor() {
    this._viewMatrix = new Csm_CubismMatrix44();
    this._models = new Csm_csmVector<LAppModel>();
    this._sceneIndex = 0;
    this.changeScene(this._sceneIndex);
  }

  _viewMatrix: Csm_CubismMatrix44; // モデル描画に用いるview行列     用于模型绘制的视图矩阵
  _models: Csm_csmVector<LAppModel>; // モデルインスタンスのコンテナ 模型实例的容器
  _sceneIndex: number; // 表示するシーンのインデックス値             显示的场景的索引值
  // モーション再生終了のコールバック関数                            运动再现结束的回调函数
  _finishedMotion = (self: ACubismMotion): void => {
    LAppPal.printMessage('Motion Finished:');
    console.log(self);
  };
}

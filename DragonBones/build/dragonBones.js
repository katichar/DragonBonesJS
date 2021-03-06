var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dragonBones;
(function (dragonBones) {
    /**
     * DragonBones
     */
    var DragonBones = (function () {
        /**
         * @private
         */
        function DragonBones() {
        }
        /**
         * @private
         */
        DragonBones.hasArmature = function (value) {
            return DragonBones._armatures.indexOf(value) >= 0;
        };
        /**
         * @private
         */
        DragonBones.addArmature = function (value) {
            if (value && DragonBones._armatures.indexOf(value) < 0) {
                DragonBones._armatures.push(value);
            }
        };
        /**
         * @private
         */
        DragonBones.removeArmature = function (value) {
            if (value) {
                var index = DragonBones._armatures.indexOf(value);
                if (index >= 0) {
                    DragonBones._armatures.splice(index, 1);
                }
            }
        };
        /**
         * @private
         */
        DragonBones.PI_D = Math.PI * 2;
        /**
         * @private
         */
        DragonBones.PI_H = Math.PI / 2;
        /**
         * @private
         */
        DragonBones.PI_Q = Math.PI / 4;
        /**
         * @private
         */
        DragonBones.ANGLE_TO_RADIAN = Math.PI / 180;
        /**
         * @private
         */
        DragonBones.RADIAN_TO_ANGLE = 180 / Math.PI;
        /**
         * @private
         */
        DragonBones.SECOND_TO_MILLISECOND = 1000;
        /**
         * @private
         */
        DragonBones.NO_TWEEN = 100;
        DragonBones.VERSION = "4.7.1";
        /**
         * @private
         */
        DragonBones.DEBUG = true;
        /**
         * @private
         */
        DragonBones._armatures = [];
        return DragonBones;
    }());
    dragonBones.DragonBones = DragonBones;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 基础对象。
     * @version DragonBones 4.5
     */
    var BaseObject = (function () {
        /**
         * @private
         */
        function BaseObject() {
            /**
             * @language zh_CN
             * 对象的唯一标识。
             * @version DragonBones 4.5
             */
            this.hashCode = BaseObject._hashCode++;
        }
        BaseObject._returnObject = function (object) {
            var objectConstructor = object.constructor;
            var classType = String(objectConstructor);
            var maxCount = BaseObject._maxCountMap[classType] == null ? BaseObject._defaultMaxCount : BaseObject._maxCountMap[classType];
            var pool = BaseObject._poolsMap[classType] = BaseObject._poolsMap[classType] || [];
            if (pool.length < maxCount) {
                if (pool.indexOf(object) < 0) {
                    pool.push(object);
                }
                else {
                    throw new Error();
                }
            }
        };
        /**
         * @private
         */
        BaseObject.toString = function () {
            throw new Error();
        };
        /**
         * @language zh_CN
         * 设置每种对象池的最大缓存数量。
         * @param objectConstructor 对象类。
         * @param maxCount 最大缓存数量。 (设置为 0 则不缓存)
         * @version DragonBones 4.5
         */
        BaseObject.setMaxCount = function (objectConstructor, maxCount) {
            if (maxCount < 0 || maxCount != maxCount) {
                maxCount = 0;
            }
            if (objectConstructor) {
                var classType = String(objectConstructor);
                BaseObject._maxCountMap[classType] = maxCount;
                var pool = BaseObject._poolsMap[classType];
                if (pool && pool.length > maxCount) {
                    pool.length = maxCount;
                }
            }
            else {
                BaseObject._defaultMaxCount = maxCount;
                for (var classType in BaseObject._poolsMap) {
                    if (BaseObject._maxCountMap[classType] == null) {
                        continue;
                    }
                    var pool = BaseObject._poolsMap[classType];
                    if (pool.length > maxCount) {
                        pool.length = maxCount;
                    }
                }
            }
        };
        /**
         * @language zh_CN
         * 清除对象池缓存的对象。
         * @param objectConstructor 对象类。 (不设置则清除所有缓存)
         * @version DragonBones 4.5
         */
        BaseObject.clearPool = function (objectConstructor) {
            if (objectConstructor === void 0) { objectConstructor = null; }
            if (objectConstructor) {
                var pool = BaseObject._poolsMap[String(objectConstructor)];
                if (pool && pool.length) {
                    pool.length = 0;
                }
            }
            else {
                for (var iP in BaseObject._poolsMap) {
                    var pool = BaseObject._poolsMap[iP];
                    pool.length = 0;
                }
            }
        };
        /**
         * @language zh_CN
         * 从对象池中创建指定对象。
         * @param objectConstructor 对象类。
         * @version DragonBones 4.5
         */
        BaseObject.borrowObject = function (objectConstructor) {
            var pool = BaseObject._poolsMap[String(objectConstructor)];
            if (pool && pool.length) {
                return pool.pop();
            }
            else {
                var object = new objectConstructor();
                object._onClear();
                return object;
            }
        };
        /**
         * @language zh_CN
         * 清除数据并返还对象池。
         * @version DragonBones 4.5
         */
        BaseObject.prototype.returnToPool = function () {
            this._onClear();
            BaseObject._returnObject(this);
        };
        BaseObject._hashCode = 0;
        BaseObject._defaultMaxCount = 5000;
        BaseObject._maxCountMap = {};
        BaseObject._poolsMap = {};
        return BaseObject;
    }());
    dragonBones.BaseObject = BaseObject;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    var TimelineState = (function (_super) {
        __extends(TimelineState, _super);
        function TimelineState() {
            _super.call(this);
        }
        /**
         * @inheritDoc
         */
        TimelineState.prototype._onClear = function () {
            this._isCompleted = false;
            this._currentPlayTimes = 0;
            this._currentTime = 0;
            this._timeline = null;
            this._isReverse = false;
            this._hasAsynchronyTimeline = false;
            this._frameRate = 0;
            this._keyFrameCount = 0;
            this._frameCount = 0;
            this._position = 0;
            this._duration = 0;
            this._animationDutation = 0;
            this._timeScale = 1;
            this._timeOffset = 0;
            this._currentFrame = null;
            this._armature = null;
            this._animationState = null;
        };
        TimelineState.prototype._onFadeIn = function () { };
        TimelineState.prototype._onUpdateFrame = function (isUpdate) { };
        TimelineState.prototype._onArriveAtFrame = function (isUpdate) { };
        TimelineState.prototype._onCrossFrame = function (frame) { };
        TimelineState.prototype._setCurrentTime = function (value) {
            var currentPlayTimes = 0;
            if (this._hasAsynchronyTimeline) {
                var playTimes = this._animationState.playTimes;
                var totalTimes = playTimes * this._duration;
                value *= this._timeScale;
                if (this._timeOffset != 0) {
                    value += this._timeOffset * this._animationDutation;
                }
                if (playTimes > 0 && (value >= totalTimes || value <= -totalTimes)) {
                    this._isCompleted = true;
                    currentPlayTimes = playTimes;
                    if (value < 0) {
                        value = 0;
                    }
                    else {
                        value = this._duration;
                    }
                }
                else {
                    this._isCompleted = false;
                    if (value < 0) {
                        currentPlayTimes = Math.floor(-value / this._duration);
                        value = this._duration - (-value % this._duration);
                    }
                    else {
                        currentPlayTimes = Math.floor(value / this._duration);
                        value %= this._duration;
                    }
                    if (playTimes > 0 && currentPlayTimes > playTimes) {
                        currentPlayTimes = playTimes;
                    }
                }
                value += this._position;
            }
            else {
                this._isCompleted = this._animationState._timeline._isCompleted;
                currentPlayTimes = this._animationState._timeline._currentPlayTimes;
            }
            if (this._currentTime == value) {
                return false;
            }
            if (this._keyFrameCount == 1 && value > this._position && this != this._animationState._timeline) {
                this._isCompleted = true;
            }
            this._isReverse = this._currentTime > value && this._currentPlayTimes == currentPlayTimes;
            this._currentTime = value;
            this._currentPlayTimes = currentPlayTimes;
            return true;
        };
        TimelineState.prototype.setCurrentTime = function (value) {
            this._setCurrentTime(value);
            switch (this._keyFrameCount) {
                case 0:
                    break;
                case 1:
                    this._currentFrame = this._timeline.frames[0];
                    this._onArriveAtFrame(false);
                    this._onUpdateFrame(false);
                    break;
                default:
                    this._currentFrame = this._timeline.frames[Math.floor(this._currentTime * this._frameRate)];
                    this._onArriveAtFrame(false);
                    this._onUpdateFrame(false);
                    break;
            }
            this._currentFrame = null;
        };
        TimelineState.prototype.fadeIn = function (armature, animationState, timelineData, time) {
            this._armature = armature;
            this._animationState = animationState;
            this._timeline = timelineData;
            var isMainTimeline = this == this._animationState._timeline;
            this._hasAsynchronyTimeline = isMainTimeline || this._animationState.animationData.hasAsynchronyTimeline;
            this._frameRate = this._armature.armatureData.frameRate;
            this._keyFrameCount = this._timeline.frames.length;
            this._frameCount = this._animationState.animationData.frameCount;
            this._position = this._animationState._position;
            this._duration = this._animationState._duration;
            this._animationDutation = this._animationState.animationData.duration;
            this._timeScale = isMainTimeline ? 1 : (1 / this._timeline.scale);
            this._timeOffset = isMainTimeline ? 0 : this._timeline.offset;
            this._onFadeIn();
            this.setCurrentTime(time);
        };
        TimelineState.prototype.fadeOut = function () { };
        TimelineState.prototype.update = function (time) {
            var self = this; // V8 bug
            var prevTime = self._currentTime;
            if (!self._isCompleted && self._setCurrentTime(time) && self._keyFrameCount) {
                var currentFrameIndex = self._keyFrameCount > 1 ? Math.floor(self._currentTime * self._frameRate) : 0;
                var currentFrame = self._timeline.frames[currentFrameIndex];
                if (self._currentFrame != currentFrame) {
                    if (self._keyFrameCount > 1) {
                        var crossedFrame = self._currentFrame;
                        self._currentFrame = currentFrame;
                        if (!crossedFrame) {
                            var prevFrameIndex = Math.floor(prevTime * self._frameRate);
                            crossedFrame = self._timeline.frames[prevFrameIndex];
                            if (!self._isReverse && prevTime <= crossedFrame.position) {
                                crossedFrame = crossedFrame.prev;
                            }
                        }
                        if (self._isReverse) {
                            while (crossedFrame != currentFrame) {
                                self._onCrossFrame(crossedFrame);
                                crossedFrame = crossedFrame.prev;
                            }
                        }
                        else {
                            while (crossedFrame != currentFrame) {
                                crossedFrame = crossedFrame.next;
                                self._onCrossFrame(crossedFrame);
                            }
                        }
                        self._onArriveAtFrame(true);
                    }
                    else {
                        self._currentFrame = currentFrame;
                        self._onCrossFrame(self._currentFrame);
                        self._onArriveAtFrame(true);
                    }
                }
                self._onUpdateFrame(true);
            }
        };
        return TimelineState;
    }(dragonBones.BaseObject));
    dragonBones.TimelineState = TimelineState;
    /**
     * @private
     */
    var TweenTimelineState = (function (_super) {
        __extends(TweenTimelineState, _super);
        function TweenTimelineState() {
            _super.call(this);
        }
        TweenTimelineState._getEasingValue = function (progress, easing) {
            var value = 1;
            if (easing > 2) {
                return progress;
            }
            else if (easing > 1) {
                value = 0.5 * (1 - Math.cos(progress * Math.PI));
                easing -= 1;
            }
            else if (easing > 0) {
                value = 1 - Math.pow(1 - progress, 2);
            }
            else if (easing >= -1) {
                easing *= -1;
                value = Math.pow(progress, 2);
            }
            else if (easing >= -2) {
                easing *= -1;
                value = Math.acos(1 - progress * 2) / Math.PI;
                easing -= 1;
            }
            else {
                return progress;
            }
            return (value - progress) * easing + progress;
        };
        TweenTimelineState._getCurveEasingValue = function (progress, sampling) {
            var x = 0;
            var y = 0;
            for (var i = 0, l = sampling.length; i < l; i += 2) {
                x = sampling[i];
                y = sampling[i + 1];
                if (x >= progress) {
                    if (i == 0) {
                        return y * progress / x;
                    }
                    else {
                        var xP = sampling[i - 2];
                        var yP = sampling[i - 1]; // i - 2 + 1
                        return yP + (y - yP) * (progress - xP) / (x - xP);
                    }
                }
            }
            return y + (1 - y) * (progress - x) / (1 - x);
        };
        /**
         * @inheritDoc
         */
        TweenTimelineState.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this._tweenProgress = 0;
            this._tweenEasing = dragonBones.DragonBones.NO_TWEEN;
            this._curve = null;
        };
        TweenTimelineState.prototype._onArriveAtFrame = function (isUpdate) {
            var self = this; // V8 bug
            self._tweenEasing = self._currentFrame.tweenEasing;
            self._curve = self._currentFrame.curve;
            if (self._keyFrameCount == 1 ||
                (self._currentFrame.next == self._timeline.frames[0] &&
                    (self._tweenEasing != dragonBones.DragonBones.NO_TWEEN || self._curve) &&
                    self._animationState.playTimes > 0 &&
                    self._animationState.currentPlayTimes == self._animationState.playTimes - 1)) {
                self._tweenEasing = dragonBones.DragonBones.NO_TWEEN;
                self._curve = null;
            }
        };
        TweenTimelineState.prototype._onUpdateFrame = function (isUpdate) {
            if (this._tweenEasing != dragonBones.DragonBones.NO_TWEEN && this._currentFrame.duration > 0) {
                this._tweenProgress = (this._currentTime - this._currentFrame.position + this._position) / this._currentFrame.duration;
                if (this._tweenEasing != 0) {
                    this._tweenProgress = TweenTimelineState._getEasingValue(this._tweenProgress, this._tweenEasing);
                }
            }
            else if (this._curve) {
                this._tweenProgress = (this._currentTime - this._currentFrame.position + this._position) / this._currentFrame.duration;
                this._tweenProgress = TweenTimelineState._getCurveEasingValue(this._tweenProgress, this._curve);
            }
            else {
                this._tweenProgress = 0;
            }
        };
        TweenTimelineState.prototype._updateExtensionKeyFrame = function (current, next, result) {
            var tweenType = 0 /* None */;
            if (current.type == next.type) {
                for (var i = 0, l = current.tweens.length; i < l; ++i) {
                    var tweenDuration = next.tweens[i] - current.tweens[i];
                    result.tweens[i] = tweenDuration;
                    if (tweenDuration != 0) {
                        tweenType = 2 /* Always */;
                    }
                }
            }
            if (tweenType == 0 /* None */) {
                if (result.type != current.type) {
                    tweenType = 1 /* Once */;
                    result.type = current.type;
                }
                if (result.tweens.length != current.tweens.length) {
                    tweenType = 1 /* Once */;
                    result.tweens.length = current.tweens.length;
                }
                if (result.keys.length != current.keys.length) {
                    tweenType = 1 /* Once */;
                    result.keys.length = current.keys.length;
                }
                for (var i = 0, l = current.keys.length; i < l; ++i) {
                    var key = current.keys[i];
                    if (result.keys[i] != key) {
                        tweenType = 1 /* Once */;
                        result.keys[i] = key;
                    }
                }
            }
            return tweenType;
        };
        return TweenTimelineState;
    }(TimelineState));
    dragonBones.TweenTimelineState = TweenTimelineState;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 基础变换对象。
     * @version DragonBones 4.5
     */
    var TransformObject = (function (_super) {
        __extends(TransformObject, _super);
        /**
         * @private
         */
        function TransformObject() {
            _super.call(this);
            /**
             * @language zh_CN
             * 相对于骨架坐标系的变换。
             * @see dragonBones.Transform
             * @version DragonBones 3.0
             */
            this.global = new dragonBones.Transform();
            /**
             * @language zh_CN
             * 相对于骨架或父骨骼坐标系的绑定变换。
             * @see dragonBones.Transform
             * @version DragonBones 3.0
             */
            this.origin = new dragonBones.Transform();
            /**
             * @language zh_CN
             * 相对于骨架或父骨骼坐标系的偏移变换。
             * @see dragonBones.Transform
             * @version DragonBones 3.0
             */
            this.offset = new dragonBones.Transform();
            /**
             * @private
             */
            this._globalTransformMatrix = new dragonBones.Matrix();
        }
        /**
         * @inheritDoc
         */
        TransformObject.prototype._onClear = function () {
            this.userData = null;
            this.name = null;
            this.globalTransformMatrix = this._globalTransformMatrix;
            this.global.identity();
            this.origin.identity();
            this.offset.identity();
            this._armature = null;
            this._parent = null;
            this._globalTransformMatrix.identity();
        };
        /**
         * @private
         */
        TransformObject.prototype._setArmature = function (value) {
            this._armature = value;
        };
        /**
         * @private
         */
        TransformObject.prototype._setParent = function (value) {
            this._parent = value;
        };
        Object.defineProperty(TransformObject.prototype, "armature", {
            /**
             * @language zh_CN
             * 所属的骨架。
             * @see dragonBones.Armature
             * @version DragonBones 3.0
             */
            get: function () {
                return this._armature;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TransformObject.prototype, "parent", {
            /**
             * @language zh_CN
             * 所属的父骨骼。
             * @see dragonBones.Bone
             * @version DragonBones 3.0
             */
            get: function () {
                return this._parent;
            },
            enumerable: true,
            configurable: true
        });
        return TransformObject;
    }(dragonBones.BaseObject));
    dragonBones.TransformObject = TransformObject;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    var TimelineData = (function (_super) {
        __extends(TimelineData, _super);
        function TimelineData() {
            _super.call(this);
            /**
             * @private
             */
            this.frames = [];
        }
        /**
         * @inheritDoc
         */
        TimelineData.prototype._onClear = function () {
            this.scale = 1;
            this.offset = 0;
            if (this.frames.length) {
                var prevFrame = null;
                for (var i = 0, l = this.frames.length; i < l; ++i) {
                    var frame = this.frames[i];
                    if (prevFrame && frame != prevFrame) {
                        prevFrame.returnToPool();
                    }
                    prevFrame = frame;
                }
                this.frames.length = 0;
            }
        };
        return TimelineData;
    }(dragonBones.BaseObject));
    dragonBones.TimelineData = TimelineData;
    /**
     * @private
     */
    var BoneTimelineData = (function (_super) {
        __extends(BoneTimelineData, _super);
        function BoneTimelineData() {
            _super.call(this);
            this.bone = null;
            this.originTransform = new dragonBones.Transform();
            this.cachedFrames = [];
        }
        BoneTimelineData.cacheFrame = function (cacheFrames, cacheFrameIndex, globalTransformMatrix) {
            var cacheMatrix = cacheFrames[cacheFrameIndex] = new dragonBones.Matrix();
            cacheMatrix.copyFrom(globalTransformMatrix);
            return cacheMatrix;
        };
        BoneTimelineData.toString = function () {
            return "[Class dragonBones.BoneTimelineData]";
        };
        /**
         * @inheritDoc
         */
        BoneTimelineData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.bone = null;
            this.originTransform.identity();
            if (this.cachedFrames.length) {
                this.cachedFrames.length = 0;
            }
        };
        BoneTimelineData.prototype.cacheFrames = function (cacheFrameCount) {
            this.cachedFrames.length = 0;
            this.cachedFrames.length = cacheFrameCount;
        };
        return BoneTimelineData;
    }(TimelineData));
    dragonBones.BoneTimelineData = BoneTimelineData;
    /**
     * @private
     */
    var SlotTimelineData = (function (_super) {
        __extends(SlotTimelineData, _super);
        function SlotTimelineData() {
            _super.call(this);
            this.slot = null;
            this.cachedFrames = [];
        }
        SlotTimelineData.cacheFrame = function (cacheFrames, cacheFrameIndex, globalTransformMatrix) {
            var cacheMatrix = cacheFrames[cacheFrameIndex] = new dragonBones.Matrix();
            cacheMatrix.copyFrom(globalTransformMatrix);
            return cacheMatrix;
        };
        SlotTimelineData.toString = function () {
            return "[Class dragonBones.SlotTimelineData]";
        };
        /**
         * @inheritDoc
         */
        SlotTimelineData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.slot = null;
            if (this.cachedFrames.length) {
                this.cachedFrames.length = 0;
            }
        };
        SlotTimelineData.prototype.cacheFrames = function (cacheFrameCount) {
            this.cachedFrames.length = 0;
            this.cachedFrames.length = cacheFrameCount;
        };
        return SlotTimelineData;
    }(TimelineData));
    dragonBones.SlotTimelineData = SlotTimelineData;
    /**
     * @private
     */
    var FFDTimelineData = (function (_super) {
        __extends(FFDTimelineData, _super);
        function FFDTimelineData() {
            _super.call(this);
            this.displayIndex = 0;
            this.skin = null;
            this.slot = null;
        }
        FFDTimelineData.toString = function () {
            return "[Class dragonBones.FFDTimelineData]";
        };
        /**
         * @inheritDoc
         */
        FFDTimelineData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.displayIndex = 0;
            this.skin = null;
            this.slot = null;
        };
        return FFDTimelineData;
    }(TimelineData));
    dragonBones.FFDTimelineData = FFDTimelineData;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    var DataParser = (function () {
        function DataParser() {
            this._data = null;
            this._armature = null;
            this._skin = null;
            this._slotDisplayDataSet = null;
            this._mesh = null;
            this._animation = null;
            this._timeline = null;
            this._isParentCooriinate = false;
            this._isAutoTween = false;
            this._animationTweenEasing = 0;
            this._armatureScale = 1;
            this._helpPoint = new dragonBones.Point();
            this._helpTransform = new dragonBones.Transform();
            this._helpMatrix = new dragonBones.Matrix();
            this._rawBones = [];
        }
        DataParser._getArmatureType = function (value) {
            switch (value.toLowerCase()) {
                case "stage":
                    return 0 /* Armature */;
                case "armature":
                    return 0 /* Armature */;
                case "movieClip":
                    return 1 /* MovieClip */;
                default:
                    return 0 /* Armature */;
            }
        };
        DataParser._getDisplayType = function (value) {
            switch (value.toLowerCase()) {
                case "image":
                    return 0 /* Image */;
                case "armature":
                    return 1 /* Armature */;
                case "mesh":
                    return 2 /* Mesh */;
                default:
                    return 0 /* Image */;
            }
        };
        DataParser._getBlendMode = function (value) {
            switch (value.toLowerCase()) {
                case "normal":
                    return 0 /* Normal */;
                case "add":
                    return 1 /* Add */;
                case "alpha":
                    return 2 /* Alpha */;
                case "darken":
                    return 3 /* Darken */;
                case "difference":
                    return 4 /* Difference */;
                case "erase":
                    return 5 /* Erase */;
                case "hardlight":
                    return 6 /* HardLight */;
                case "invert":
                    return 7 /* Invert */;
                case "layer":
                    return 8 /* Layer */;
                case "lighten":
                    return 9 /* Lighten */;
                case "multiply":
                    return 10 /* Multiply */;
                case "overlay":
                    return 11 /* Overlay */;
                case "screen":
                    return 12 /* Screen */;
                case "subtract":
                    return 13 /* Subtract */;
                default:
                    return 0 /* Normal */;
            }
        };
        DataParser._getActionType = function (value) {
            switch (value.toLowerCase()) {
                case "play":
                    return 0 /* Play */;
                case "stop":
                    return 1 /* Stop */;
                case "gotoandplay":
                    return 2 /* GotoAndPlay */;
                case "gotoandstop":
                    return 3 /* GotoAndStop */;
                case "fadein":
                    return 4 /* FadeIn */;
                case "fadeout":
                    return 5 /* FadeOut */;
                default:
                    return 4 /* FadeIn */;
            }
        };
        DataParser.prototype._getTimelineFrameMatrix = function (animation, timeline, position, transform) {
            var frameIndex = Math.floor(position * animation.frameCount / animation.duration); // uint()
            if (timeline.frames.length == 1 || frameIndex >= timeline.frames.length) {
                transform.copyFrom(timeline.frames[0].transform);
            }
            else {
                var frame = timeline.frames[frameIndex];
                var tweenProgress = 0;
                if (frame.duration > 0 && frame.tweenEasing != dragonBones.DragonBones.NO_TWEEN) {
                    tweenProgress = (position - frame.position) / frame.duration;
                    if (frame.tweenEasing != 0) {
                        tweenProgress = dragonBones.TweenTimelineState._getEasingValue(tweenProgress, frame.tweenEasing);
                    }
                }
                else if (frame.curve) {
                    tweenProgress = (position - frame.position) / frame.duration;
                    tweenProgress = dragonBones.TweenTimelineState._getCurveEasingValue(tweenProgress, frame.curve);
                }
                transform.x = frame.next.transform.x - frame.transform.x;
                transform.y = frame.next.transform.y - frame.transform.y;
                transform.skewX = dragonBones.Transform.normalizeRadian(frame.next.transform.skewX - frame.transform.skewX);
                transform.skewY = dragonBones.Transform.normalizeRadian(frame.next.transform.skewY - frame.transform.skewY);
                transform.scaleX = frame.next.transform.scaleX - frame.transform.scaleX;
                transform.scaleY = frame.next.transform.scaleY - frame.transform.scaleY;
                transform.x = frame.transform.x + transform.x * tweenProgress;
                transform.y = frame.transform.y + transform.y * tweenProgress;
                transform.skewX = frame.transform.skewX + transform.skewX * tweenProgress;
                transform.skewY = frame.transform.skewY + transform.skewY * tweenProgress;
                transform.scaleX = frame.transform.scaleX + transform.scaleX * tweenProgress;
                transform.scaleY = frame.transform.scaleY + transform.scaleY * tweenProgress;
            }
            transform.add(timeline.originTransform);
        };
        DataParser.prototype._mergeFrameToAnimationTimeline = function (frame, actions, events) {
            var frameStart = Math.floor(frame.position * this._armature.frameRate); // uint()
            var frames = this._animation.frames;
            if (frames.length == 0) {
                var startFrame = dragonBones.BaseObject.borrowObject(dragonBones.AnimationFrameData); // Add start frame.
                startFrame.position = 0;
                if (this._animation.frameCount > 1) {
                    frames.length = this._animation.frameCount + 1; // One more count for zero duration frame.
                    var endFrame = dragonBones.BaseObject.borrowObject(dragonBones.AnimationFrameData); // Add end frame to keep animation timeline has two different frames atleast.
                    endFrame.position = this._animation.frameCount / this._armature.frameRate;
                    frames[0] = startFrame;
                    frames[this._animation.frameCount] = endFrame;
                }
            }
            var insertedFrame = null;
            var replacedFrame = frames[frameStart];
            if (replacedFrame && (frameStart == 0 || frames[frameStart - 1] == replacedFrame.prev)) {
                insertedFrame = replacedFrame;
            }
            else {
                insertedFrame = dragonBones.BaseObject.borrowObject(dragonBones.AnimationFrameData); // Create frame.
                insertedFrame.position = frameStart / this._armature.frameRate;
                frames[frameStart] = insertedFrame;
                for (var i = frameStart + 1, l = frames.length; i < l; ++i) {
                    if (replacedFrame && frames[i] == replacedFrame) {
                        frames[i] = null;
                    }
                }
            }
            if (actions) {
                for (var i = 0, l = actions.length; i < l; ++i) {
                    insertedFrame.actions.push(actions[i]);
                }
            }
            if (events) {
                for (var i = 0, l = events.length; i < l; ++i) {
                    insertedFrame.events.push(events[i]);
                }
            }
            // Modify frame link and duration.
            var prevFrame = null;
            var nextFrame = null;
            for (var i = 0, l = frames.length; i < l; ++i) {
                var currentFrame = frames[i];
                if (currentFrame && nextFrame != currentFrame) {
                    nextFrame = currentFrame;
                    if (prevFrame) {
                        nextFrame.prev = prevFrame;
                        prevFrame.next = nextFrame;
                        prevFrame.duration = nextFrame.position - prevFrame.position;
                    }
                    prevFrame = nextFrame;
                }
                else {
                    frames[i] = prevFrame;
                }
            }
            nextFrame.duration = this._animation.duration - nextFrame.position;
            nextFrame = frames[0];
            prevFrame.next = nextFrame;
            nextFrame.prev = prevFrame;
        };
        DataParser.prototype._globalToLocal = function (armature) {
            var keyFrames = [];
            var bones = armature.sortedBones.concat().reverse();
            for (var i = 0, l = bones.length; i < l; ++i) {
                var bone = bones[i];
                if (bone.parent) {
                    bone.parent.transform.toMatrix(this._helpMatrix);
                    this._helpMatrix.invert();
                    this._helpMatrix.transformPoint(bone.transform.x, bone.transform.y, bone.transform);
                    bone.transform.rotation -= bone.parent.transform.rotation;
                }
                for (var i_1 in armature.animations) {
                    var animation = armature.animations[i_1];
                    var timeline = animation.getBoneTimeline(bone.name);
                    if (!timeline) {
                        continue;
                    }
                    var parentTimeline = timeline.bone.parent ? animation.getBoneTimeline(timeline.bone.parent.name) : null;
                    keyFrames.length = 0;
                    for (var i_2 = 0, l_1 = timeline.frames.length; i_2 < l_1; ++i_2) {
                        var frame = timeline.frames[i_2];
                        if (keyFrames.indexOf(frame) >= 0) {
                            continue;
                        }
                        keyFrames.push(frame);
                        if (parentTimeline) {
                            this._getTimelineFrameMatrix(animation, parentTimeline, frame.position, this._helpTransform);
                            frame.transform.add(timeline.originTransform);
                            this._helpTransform.toMatrix(this._helpMatrix);
                            this._helpMatrix.invert();
                            this._helpMatrix.transformPoint(frame.transform.x, frame.transform.y, frame.transform);
                            frame.transform.rotation -= this._helpTransform.rotation;
                        }
                        else {
                            frame.transform.add(timeline.originTransform);
                        }
                    }
                    keyFrames.length = 0;
                    for (var i_3 = 0, l_2 = timeline.frames.length; i_3 < l_2; ++i_3) {
                        var frame = timeline.frames[i_3];
                        if (keyFrames.indexOf(frame) >= 0) {
                            continue;
                        }
                        keyFrames.push(frame);
                        frame.transform.minus(timeline.bone.transform);
                        if (i_3 == 0) {
                            timeline.originTransform.copyFrom(frame.transform);
                            frame.transform.identity();
                        }
                        else {
                            frame.transform.minus(timeline.originTransform);
                        }
                    }
                }
            }
        };
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#parseDragonBonesData()
         */
        DataParser.parseDragonBonesData = function (rawData) {
            return dragonBones.ObjectDataParser.getInstance().parseDragonBonesData(rawData);
        };
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#parsetTextureAtlasData()
         */
        DataParser.parseTextureAtlasData = function (rawData, scale) {
            if (scale === void 0) { scale = 1; }
            var textureAtlasData = {};
            var subTextureFrame = null;
            var subTextureList = rawData[DataParser.SUB_TEXTURE];
            for (var i = 0, len = subTextureList.length; i < len; i++) {
                var subTextureObject = subTextureList[i];
                var subTextureName = subTextureObject[DataParser.NAME];
                var subTextureRegion = new dragonBones.Rectangle();
                subTextureRegion.x = subTextureObject[DataParser.X] / scale;
                subTextureRegion.y = subTextureObject[DataParser.Y] / scale;
                subTextureRegion.width = subTextureObject[DataParser.WIDTH] / scale;
                subTextureRegion.height = subTextureObject[DataParser.HEIGHT] / scale;
                if (DataParser.FRAME_WIDTH in subTextureObject) {
                    subTextureFrame = new dragonBones.Rectangle();
                    subTextureFrame.x = subTextureObject[DataParser.FRAME_X] / scale;
                    subTextureFrame.y = subTextureObject[DataParser.FRAME_Y] / scale;
                    subTextureFrame.width = subTextureObject[DataParser.FRAME_WIDTH] / scale;
                    subTextureFrame.height = subTextureObject[DataParser.FRAME_HEIGHT] / scale;
                }
                else {
                    subTextureFrame = null;
                }
                textureAtlasData[subTextureName] = { region: subTextureRegion, frame: subTextureFrame, rotated: false };
            }
            return textureAtlasData;
        };
        DataParser.DATA_VERSION_2_3 = "2.3";
        DataParser.DATA_VERSION_3_0 = "3.0";
        DataParser.DATA_VERSION_4_0 = "4.0";
        DataParser.DATA_VERSION = "4.5";
        DataParser.TEXTURE_ATLAS = "TextureAtlas";
        DataParser.SUB_TEXTURE = "SubTexture";
        DataParser.FORMAT = "format";
        DataParser.IMAGE_PATH = "imagePath";
        DataParser.WIDTH = "width";
        DataParser.HEIGHT = "height";
        DataParser.ROTATED = "rotated";
        DataParser.FRAME_X = "frameX";
        DataParser.FRAME_Y = "frameY";
        DataParser.FRAME_WIDTH = "frameWidth";
        DataParser.FRAME_HEIGHT = "frameHeight";
        DataParser.DRADON_BONES = "dragonBones";
        DataParser.ARMATURE = "armature";
        DataParser.BONE = "bone";
        DataParser.IK = "ik";
        DataParser.SLOT = "slot";
        DataParser.SKIN = "skin";
        DataParser.DISPLAY = "display";
        DataParser.ANIMATION = "animation";
        DataParser.FFD = "ffd";
        DataParser.FRAME = "frame";
        DataParser.PIVOT = "pivot";
        DataParser.TRANSFORM = "transform";
        DataParser.COLOR = "color";
        DataParser.FILTER = "filter";
        DataParser.VERSION = "version";
        DataParser.IS_GLOBAL = "isGlobal";
        DataParser.FRAME_RATE = "frameRate";
        DataParser.TYPE = "type";
        DataParser.NAME = "name";
        DataParser.PARENT = "parent";
        DataParser.LENGTH = "length";
        DataParser.DATA = "data";
        DataParser.DISPLAY_INDEX = "displayIndex";
        DataParser.Z_ORDER = "z";
        DataParser.BLEND_MODE = "blendMode";
        DataParser.INHERIT_TRANSLATION = "inheritTranslation";
        DataParser.INHERIT_ROTATION = "inheritRotation";
        DataParser.INHERIT_SCALE = "inheritScale";
        DataParser.TARGET = "target";
        DataParser.BEND_POSITIVE = "bendPositive";
        DataParser.CHAIN = "chain";
        DataParser.WEIGHT = "weight";
        DataParser.FADE_IN_TIME = "fadeInTime";
        DataParser.PLAY_TIMES = "playTimes";
        DataParser.SCALE = "scale";
        DataParser.OFFSET = "offset";
        DataParser.POSITION = "position";
        DataParser.DURATION = "duration";
        DataParser.TWEEN_EASING = "tweenEasing";
        DataParser.TWEEN_ROTATE = "tweenRotate";
        DataParser.TWEEN_SCALE = "tweenScale";
        DataParser.CURVE = "curve";
        DataParser.EVENT = "event";
        DataParser.SOUND = "sound";
        DataParser.ACTION = "action";
        DataParser.ACTIONS = "actions";
        DataParser.DEFAULT_ACTIONS = "defaultActions";
        DataParser.X = "x";
        DataParser.Y = "y";
        DataParser.SKEW_X = "skX";
        DataParser.SKEW_Y = "skY";
        DataParser.SCALE_X = "scX";
        DataParser.SCALE_Y = "scY";
        DataParser.ALPHA_OFFSET = "aO";
        DataParser.RED_OFFSET = "rO";
        DataParser.GREEN_OFFSET = "gO";
        DataParser.BLUE_OFFSET = "bO";
        DataParser.ALPHA_MULTIPLIER = "aM";
        DataParser.RED_MULTIPLIER = "rM";
        DataParser.GREEN_MULTIPLIER = "gM";
        DataParser.BLUE_MULTIPLIER = "bM";
        DataParser.UVS = "uvs";
        DataParser.VERTICES = "vertices";
        DataParser.TRIANGLES = "triangles";
        DataParser.WEIGHTS = "weights";
        DataParser.SLOT_POSE = "slotPose";
        DataParser.BONE_POSE = "bonePose";
        DataParser.TWEEN = "tween";
        DataParser.KEY = "key";
        DataParser.COLOR_TRANSFORM = "colorTransform";
        DataParser.TIMELINE = "timeline";
        DataParser.PIVOT_X = "pX";
        DataParser.PIVOT_Y = "pY";
        DataParser.LOOP = "loop";
        DataParser.AUTO_TWEEN = "autoTween";
        DataParser.HIDE = "hide";
        DataParser.RECTANGLE = "rectangle";
        DataParser.ELLIPSE = "ellipse";
        return DataParser;
    }());
    dragonBones.DataParser = DataParser;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 动画控制器，用来播放动画数据，管理动画状态。
     * @see dragonBones.AnimationData
     * @see dragonBones.AnimationState
     * @version DragonBones 3.0
     */
    var Animation = (function (_super) {
        __extends(Animation, _super);
        /**
         * @private
         */
        function Animation() {
            _super.call(this);
            /**
             * @private
             */
            this._animations = {};
            /**
             * @private
             */
            this._animationNames = [];
            /**
             * @private
             */
            this._animationStates = [];
        }
        /**
         * @private
         */
        Animation._sortAnimationState = function (a, b) {
            return a.layer > b.layer ? 1 : -1;
        };
        /**
         * @private
         */
        Animation.toString = function () {
            return "[Class dragonBones.Animation]";
        };
        /**
         * @inheritDoc
         */
        Animation.prototype._onClear = function () {
            this.timeScale = 1;
            this._animationStateDirty = false;
            this._timelineStateDirty = false;
            this._armature = null;
            this._isPlaying = false;
            this._time = 0;
            this._lastAnimationState = null;
            for (var i in this._animations) {
                delete this._animations[i];
            }
            if (this._animationNames.length) {
                this._animationNames.length = 0;
            }
            for (var i = 0, l = this._animationStates.length; i < l; ++i) {
                this._animationStates[i].returnToPool();
            }
            this._animationStates.length = 0;
        };
        /**
         * @private
         */
        Animation.prototype._fadeOut = function (fadeOutTime, layer, group, fadeOutMode, pauseFadeOut) {
            var i = 0, l = this._animationStates.length;
            var animationState = null;
            switch (fadeOutMode) {
                case 0 /* None */:
                    break;
                case 1 /* SameLayer */:
                    for (; i < l; ++i) {
                        animationState = this._animationStates[i];
                        if (animationState.layer == layer) {
                            animationState.fadeOut(fadeOutTime, pauseFadeOut);
                        }
                    }
                    break;
                case 2 /* SameGroup */:
                    for (; i < l; ++i) {
                        animationState = this._animationStates[i];
                        if (animationState.group == group) {
                            animationState.fadeOut(fadeOutTime, pauseFadeOut);
                        }
                    }
                    break;
                case 4 /* All */:
                    for (; i < l; ++i) {
                        animationState = this._animationStates[i];
                        animationState.fadeOut(fadeOutTime, pauseFadeOut);
                    }
                    break;
                case 3 /* SameLayerAndGroup */:
                    for (; i < l; ++i) {
                        animationState = this._animationStates[i];
                        if (animationState.layer == layer && animationState.group == group) {
                            animationState.fadeOut(fadeOutTime, pauseFadeOut);
                        }
                    }
                    break;
            }
        };
        /**
         * @private
         */
        Animation.prototype._updateFFDTimelineStates = function () {
            for (var i = 0, l = this._animationStates.length; i < l; ++i) {
                this._animationStates[i]._updateFFDTimelineStates();
            }
        };
        /**
         * @private
         */
        Animation.prototype._advanceTime = function (passedTime) {
            if (!this._isPlaying) {
                return;
            }
            if (passedTime < 0) {
                passedTime = -passedTime;
            }
            var animationStateCount = this._animationStates.length;
            if (animationStateCount == 1) {
                var animationState = this._animationStates[0];
                if (animationState._isFadeOutComplete) {
                    animationState.returnToPool();
                    this._animationStates.length = 0;
                    this._animationStateDirty = true;
                    this._lastAnimationState = null;
                }
                else {
                    if (this._timelineStateDirty) {
                        animationState._updateTimelineStates();
                    }
                    animationState._advanceTime(passedTime, 1, 0);
                }
            }
            else if (animationStateCount > 1) {
                var prevLayer = this._animationStates[0]._layer;
                var weightLeft = 1;
                var layerTotalWeight = 0;
                var layerIndex = 1;
                for (var i = 0, r = 0; i < animationStateCount; ++i) {
                    var animationState = this._animationStates[i];
                    if (animationState._isFadeOutComplete) {
                        r++;
                        animationState.returnToPool();
                        if (this._lastAnimationState == animationState) {
                            if (i - r >= 0) {
                                this._lastAnimationState = this._animationStates[i - r];
                            }
                            else {
                                this._lastAnimationState = null;
                            }
                        }
                    }
                    else {
                        if (r > 0) {
                            this._animationStates[i - r] = animationState;
                        }
                        if (prevLayer != animationState._layer) {
                            prevLayer = animationState._layer;
                            if (layerTotalWeight >= weightLeft) {
                                weightLeft = 0;
                            }
                            else {
                                weightLeft -= layerTotalWeight;
                            }
                            layerTotalWeight = 0;
                        }
                        if (this._timelineStateDirty) {
                            animationState._updateTimelineStates();
                        }
                        animationState._advanceTime(passedTime, weightLeft, layerIndex);
                        if (animationState._weightResult != 0) {
                            layerTotalWeight += animationState._weightResult;
                            layerIndex++;
                        }
                    }
                    if (i == animationStateCount - 1 && r > 0) {
                        this._animationStates.length -= r;
                    }
                }
            }
            this._timelineStateDirty = false;
        };
        /**
         * @language zh_CN
         * 清除所有正在播放的动画状态。
         * @version DragonBones 4.5
         */
        Animation.prototype.reset = function () {
            this._isPlaying = false;
            this._lastAnimationState = null;
            for (var i = 0, l = this._animationStates.length; i < l; ++i) {
                this._animationStates[i].returnToPool();
            }
            this._animationStates.length = 0;
        };
        /**
         * @language zh_CN
         * 暂停播放动画。
         * @param animationName 动画状态的名称，如果未设置，则暂停所有动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         */
        Animation.prototype.stop = function (animationName) {
            if (animationName === void 0) { animationName = null; }
            if (animationName) {
                var animationState = this.getState(animationName);
                if (animationState) {
                    animationState.stop();
                }
            }
            else {
                this._isPlaying = false;
            }
        };
        /**
         * @language zh_CN
         * 播放动画。
         * @param animationName 动画数据的名称，如果未设置，则播放默认动画，或将暂停状态切换为播放状态，或重新播放上一个正在播放的动画。
         * @param playTimes 动画需要播放的次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         */
        Animation.prototype.play = function (animationName, playTimes) {
            if (animationName === void 0) { animationName = null; }
            if (playTimes === void 0) { playTimes = -1; }
            var animationState = null;
            if (animationName) {
                animationState = this.fadeIn(animationName, 0, playTimes, 0, null, 4 /* All */);
            }
            else if (!this._lastAnimationState) {
                var defaultAnimation = this._armature.armatureData.defaultAnimation;
                if (defaultAnimation) {
                    animationState = this.fadeIn(defaultAnimation.name, 0, playTimes, 0, null, 4 /* All */);
                }
            }
            else if (!this._isPlaying) {
                this._isPlaying = true;
            }
            else {
                animationState = this.fadeIn(this._lastAnimationState.name, 0, playTimes, 0, null, 4 /* All */);
            }
            return animationState;
        };
        /**
         * @language zh_CN
         * 淡入播放指定名称的动画。
         * @param animationName 动画数据的名称。
         * @param playTimes 循环播放的次数。 [-1: 使用数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @param fadeInTime 淡入的时间。 [-1: 使用数据默认值, [0~N]: N 秒淡入完毕] (以秒为单位)
         * @param layer 混合的图层，图层高会优先获取混合权重。
         * @param group 混合的组，用于给动画状态编组，方便混合淡出控制。
         * @param fadeOutMode 淡出的模式。
         * @param additiveBlending 以叠加的形式混合。
         * @param displayControl 是否对显示对象属性可控。
         * @param pauseFadeOut 暂停需要淡出的动画。
         * @param pauseFadeIn 暂停需要淡入的动画，直到淡入结束才开始播放。
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationFadeOutMode
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        Animation.prototype.fadeIn = function (animationName, fadeInTime, playTimes, layer, group, fadeOutMode, additiveBlending, displayControl, pauseFadeOut, pauseFadeIn) {
            if (fadeInTime === void 0) { fadeInTime = -1; }
            if (playTimes === void 0) { playTimes = -1; }
            if (layer === void 0) { layer = 0; }
            if (group === void 0) { group = null; }
            if (fadeOutMode === void 0) { fadeOutMode = 3 /* SameLayerAndGroup */; }
            if (additiveBlending === void 0) { additiveBlending = false; }
            if (displayControl === void 0) { displayControl = true; }
            if (pauseFadeOut === void 0) { pauseFadeOut = true; }
            if (pauseFadeIn === void 0) { pauseFadeIn = true; }
            var clipData = this._animations[animationName];
            if (!clipData) {
                this._time = 0;
                console.warn("No animation.", " Armature: " + this._armature.name, " Animation: " + animationName);
                return null;
            }
            this._isPlaying = true;
            if (fadeInTime != fadeInTime || fadeInTime < 0) {
                if (this._lastAnimationState) {
                    fadeInTime = clipData.fadeInTime;
                }
                else {
                    fadeInTime = 0;
                }
            }
            if (playTimes < 0) {
                playTimes = clipData.playTimes;
            }
            this._fadeOut(fadeInTime, layer, group, fadeOutMode, pauseFadeOut);
            this._lastAnimationState = dragonBones.BaseObject.borrowObject(dragonBones.AnimationState);
            this._lastAnimationState._layer = layer;
            this._lastAnimationState._group = group;
            this._lastAnimationState.additiveBlending = additiveBlending;
            this._lastAnimationState.displayControl = displayControl;
            this._lastAnimationState._fadeIn(this._armature, clipData.animation || clipData, animationName, playTimes, clipData.position, clipData.duration, this._time, 1 / clipData.scale, fadeInTime, pauseFadeIn);
            this._animationStates.push(this._lastAnimationState);
            this._animationStateDirty = true;
            this._time = 0;
            if (this._animationStates.length > 1) {
                this._animationStates.sort(Animation._sortAnimationState);
            }
            var slots = this._armature.getSlots();
            for (var i = 0, l = slots.length; i < l; ++i) {
                var slot = slots[i];
                if (slot.inheritAnimation) {
                    var childArmature = slot.childArmature;
                    if (childArmature &&
                        childArmature.animation.hasAnimation(animationName) &&
                        !childArmature.animation.getState(animationName)) {
                        childArmature.animation.fadeIn(animationName);
                    }
                }
            }
            this._armature.advanceTime(0);
            return this._lastAnimationState;
        };
        /**
         * @language zh_CN
         * 指定名称的动画从指定时间开始播放。
         * @param animationName 动画数据的名称。
         * @param time 时间。 (以秒为单位)
         * @param playTimes 动画循环播放的次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        Animation.prototype.gotoAndPlayByTime = function (animationName, time, playTimes) {
            if (time === void 0) { time = 0; }
            if (playTimes === void 0) { playTimes = -1; }
            this._time = time;
            return this.fadeIn(animationName, 0, playTimes, 0, null, 4 /* All */);
        };
        /**
         * @language zh_CN
         * 指定名称的动画从指定帧开始播放。
         * @param animationName 动画数据的名称。
         * @param frame 帧。
         * @param playTimes 动画循环播放的次数。[-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        Animation.prototype.gotoAndPlayByFrame = function (animationName, frame, playTimes) {
            if (frame === void 0) { frame = 0; }
            if (playTimes === void 0) { playTimes = -1; }
            var clipData = this._animations[animationName];
            if (clipData) {
                this._time = clipData.duration * frame / clipData.frameCount;
            }
            return this.fadeIn(animationName, 0, playTimes, 0, null, 4 /* All */);
        };
        /**
         * @language zh_CN
         * 指定名称的动画从指定进度开始播放。
         * @param animationName 动画数据的名称。
         * @param progress 进度。 [0~1]
         * @param playTimes 动画循环播放的次数。[-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        Animation.prototype.gotoAndPlayByProgress = function (animationName, progress, playTimes) {
            if (progress === void 0) { progress = 0; }
            if (playTimes === void 0) { playTimes = -1; }
            var clipData = this._animations[animationName];
            if (clipData) {
                this._time = clipData.duration * Math.max(progress, 0);
            }
            return this.fadeIn(animationName, 0, playTimes, 0, null, 4 /* All */);
        };
        /**
         * @language zh_CN
         * 播放指定名称的动画到指定的时间并停止。
         * @param animationName 动画数据的名称。
         * @param time 时间。 (以秒为单位)
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        Animation.prototype.gotoAndStopByTime = function (animationName, time) {
            if (time === void 0) { time = 0; }
            var animationState = this.gotoAndPlayByTime(animationName, time, 1);
            if (animationState) {
                this._isPlaying = false;
                animationState.stop();
            }
            return animationState;
        };
        /**
         * @language zh_CN
         * 播放指定名称的动画到指定的帧并停止。
         * @param animationName 动画数据的名称。
         * @param frame 帧。
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        Animation.prototype.gotoAndStopByFrame = function (animationName, frame) {
            if (frame === void 0) { frame = 0; }
            var animationState = this.gotoAndPlayByFrame(animationName, frame, 1);
            if (animationState) {
                this._isPlaying = false;
                animationState.stop();
            }
            return animationState;
        };
        /**
         * @language zh_CN
         * 播放指定名称的动画到指定的进度并停止。
         * @param animationName 动画数据的名称。
         * @param progress 进度。 [0~1]
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        Animation.prototype.gotoAndStopByProgress = function (animationName, progress) {
            if (progress === void 0) { progress = 0; }
            var animationState = this.gotoAndPlayByProgress(animationName, progress, 1);
            if (animationState) {
                this._isPlaying = false;
                animationState.stop();
            }
            return animationState;
        };
        /**
         * @language zh_CN
         * 获取指定名称的动画状态。
         * @param animationName 动画状态的名称。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         */
        Animation.prototype.getState = function (animationName) {
            for (var i = 0, l = this._animationStates.length; i < l; ++i) {
                var animationState = this._animationStates[i];
                if (animationState.name == animationName) {
                    return animationState;
                }
            }
            return null;
        };
        /**
         * @language zh_CN
         * 是否包含指定名称的动画数据。
         * @param animationName 动画数据的名称。
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         */
        Animation.prototype.hasAnimation = function (animationName) {
            return this._animations[animationName] != null;
        };
        Object.defineProperty(Animation.prototype, "isPlaying", {
            /**
             * @language zh_CN
             * 动画是否处于播放状态。
             * @version DragonBones 3.0
             */
            get: function () {
                return this._isPlaying;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation.prototype, "isCompleted", {
            /**
             * @language zh_CN
             * 所有动画状态是否均已播放完毕。
             * @see dragonBones.AnimationState
             * @version DragonBones 3.0
             */
            get: function () {
                if (this._lastAnimationState) {
                    if (!this._lastAnimationState.isCompleted) {
                        return false;
                    }
                    for (var i = 0, l = this._animationStates.length; i < l; ++i) {
                        if (!this._animationStates[i].isCompleted) {
                            return false;
                        }
                    }
                }
                return true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation.prototype, "lastAnimationName", {
            /**
             * @language zh_CN
             * 上一个正在播放的动画状态的名称。
             * @see #lastAnimationState
             * @version DragonBones 3.0
             */
            get: function () {
                return this._lastAnimationState ? this._lastAnimationState.name : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation.prototype, "lastAnimationState", {
            /**
             * @language zh_CN
             * 上一个正在播放的动画状态。
             * @see dragonBones.AnimationState
             * @version DragonBones 3.0
             */
            get: function () {
                return this._lastAnimationState;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation.prototype, "animationNames", {
            /**
             * @language zh_CN
             * 所有动画数据名称。
             * @see #animations
             * @version DragonBones 4.5
             */
            get: function () {
                return this._animationNames;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation.prototype, "animations", {
            /**
             * @language zh_CN
             * 所有的动画数据。
             * @see dragonBones.AnimationData
             * @version DragonBones 4.5
             */
            get: function () {
                return this._animations;
            },
            set: function (value) {
                if (this._animations == value) {
                    return;
                }
                for (var i in this._animations) {
                    delete this._animations[i];
                }
                this._animationNames.length = 0;
                if (value) {
                    for (var i in value) {
                        this._animations[i] = value[i];
                        this._animationNames.push(i);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @deprecated
         * @see #play()
         * @see #fadeIn()
         * @see #gotoAndPlayByTime()
         * @see #gotoAndPlayByFrame()
         * @see #gotoAndPlayByProgress()
         */
        Animation.prototype.gotoAndPlay = function (animationName, fadeInTime, duration, playTimes, layer, group, fadeOutMode, pauseFadeOut, pauseFadeIn) {
            if (fadeInTime === void 0) { fadeInTime = -1; }
            if (duration === void 0) { duration = -1; }
            if (playTimes === void 0) { playTimes = -1; }
            if (layer === void 0) { layer = 0; }
            if (group === void 0) { group = null; }
            if (fadeOutMode === void 0) { fadeOutMode = 3 /* SameLayerAndGroup */; }
            if (pauseFadeOut === void 0) { pauseFadeOut = true; }
            if (pauseFadeIn === void 0) { pauseFadeIn = true; }
            var animationState = this.fadeIn(animationName, fadeInTime, playTimes, layer, group, fadeOutMode, false, true, pauseFadeOut, pauseFadeIn);
            if (animationState && duration && duration > 0) {
                animationState.timeScale = animationState.totalTime / duration;
            }
            return animationState;
        };
        /**
         * @deprecated
         * @see #gotoAndStopByTime()
         * @see #gotoAndStopByFrame()
         * @see #gotoAndStopByProgress()
         */
        Animation.prototype.gotoAndStop = function (animationName, time) {
            if (time === void 0) { time = 0; }
            return this.gotoAndStopByTime(animationName, time);
        };
        Object.defineProperty(Animation.prototype, "animationList", {
            /**
             * @deprecated
             * @see #animationNames
             * @see #animations
             */
            get: function () {
                return this._animationNames;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation.prototype, "animationDataList", {
            /**
             * @language zh_CN
             * @deprecated
             * @see #animationNames
             * @see #animations
             */
            get: function () {
                var list = [];
                for (var i = 0, l = this._animationNames.length; i < l; ++i) {
                    list.push(this._animations[this._animationNames[i]]);
                }
                return list;
            },
            enumerable: true,
            configurable: true
        });
        return Animation;
    }(dragonBones.BaseObject));
    dragonBones.Animation = Animation;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 动画状态，播放动画时产生，可以对单个动画的播放进行更细致的控制和调节。
     * @see dragonBones.Animation
     * @see dragonBones.AnimationData
     * @version DragonBones 3.0
     */
    var AnimationState = (function (_super) {
        __extends(AnimationState, _super);
        /**
         * @private
         */
        function AnimationState() {
            _super.call(this);
            /**
             * @private
             */
            this._boneMask = [];
            /**
             * @private
             */
            this._boneTimelines = [];
            /**
             * @private
             */
            this._slotTimelines = [];
            /**
             * @private
             */
            this._ffdTimelines = [];
            /**
             * @deprecated
             */
            this.autoTween = false;
        }
        /**
         * @private
         */
        AnimationState.toString = function () {
            return "[Class dragonBones.AnimationState]";
        };
        /**
         * @inheritDoc
         */
        AnimationState.prototype._onClear = function () {
            this.displayControl = true;
            this.additiveBlending = false;
            this.playTimes = 1;
            this.timeScale = 1;
            this.weight = 1;
            this.autoFadeOutTime = -1;
            this.fadeTotalTime = 0;
            this._isFadeOutComplete = false;
            this._layer = 0;
            this._position = 0;
            this._duration = 0;
            this._weightResult = 0;
            this._fadeProgress = 0;
            this._group = null;
            if (this._timeline) {
                this._timeline.returnToPool();
                this._timeline = null;
            }
            this._isPlaying = true;
            this._isPausePlayhead = false;
            this._isFadeOut = false;
            this._currentPlayTimes = 0;
            this._fadeTime = 0;
            this._time = 0;
            this._name = null;
            this._armature = null;
            this._animationData = null;
            if (this._boneMask.length) {
                this._boneMask.length = 0;
            }
            for (var i = 0, l = this._boneTimelines.length; i < l; ++i) {
                this._boneTimelines[i].returnToPool();
            }
            for (var i = 0, l = this._slotTimelines.length; i < l; ++i) {
                this._slotTimelines[i].returnToPool();
            }
            for (var i = 0, l = this._ffdTimelines.length; i < l; ++i) {
                this._ffdTimelines[i].returnToPool();
            }
            this._boneTimelines.length = 0;
            this._slotTimelines.length = 0;
            this._ffdTimelines.length = 0;
        };
        /**
         * @private
         */
        AnimationState.prototype._advanceFadeTime = function (passedTime) {
            if (passedTime < 0) {
                passedTime = -passedTime;
            }
            this._fadeTime += passedTime;
            var fadeProgress = 0;
            if (this._fadeTime >= this.fadeTotalTime) {
                fadeProgress = this._isFadeOut ? 0 : 1;
            }
            else if (this._fadeTime > 0) {
                fadeProgress = this._isFadeOut ? (1 - this._fadeTime / this.fadeTotalTime) : (this._fadeTime / this.fadeTotalTime);
            }
            else {
                fadeProgress = this._isFadeOut ? 1 : 0;
            }
            if (this._fadeProgress != fadeProgress) {
                this._fadeProgress = fadeProgress;
                var eventDispatcher = this._armature._display;
                if (this._fadeTime <= passedTime) {
                    if (this._isFadeOut) {
                        if (eventDispatcher.hasEvent(dragonBones.EventObject.FADE_OUT)) {
                            var event_1 = dragonBones.BaseObject.borrowObject(dragonBones.EventObject);
                            event_1.animationState = this;
                            this._armature._bufferEvent(event_1, dragonBones.EventObject.FADE_OUT);
                        }
                    }
                    else {
                        if (eventDispatcher.hasEvent(dragonBones.EventObject.FADE_IN)) {
                            var event_2 = dragonBones.BaseObject.borrowObject(dragonBones.EventObject);
                            event_2.animationState = this;
                            this._armature._bufferEvent(event_2, dragonBones.EventObject.FADE_IN);
                        }
                    }
                }
                if (this._fadeTime >= this.fadeTotalTime) {
                    if (this._isFadeOut) {
                        this._isFadeOutComplete = true;
                        if (eventDispatcher.hasEvent(dragonBones.EventObject.FADE_OUT_COMPLETE)) {
                            var event_3 = dragonBones.BaseObject.borrowObject(dragonBones.EventObject);
                            event_3.animationState = this;
                            this._armature._bufferEvent(event_3, dragonBones.EventObject.FADE_OUT_COMPLETE);
                        }
                    }
                    else {
                        this._isPausePlayhead = false;
                        if (eventDispatcher.hasEvent(dragonBones.EventObject.FADE_IN_COMPLETE)) {
                            var event_4 = dragonBones.BaseObject.borrowObject(dragonBones.EventObject);
                            event_4.animationState = this;
                            this._armature._bufferEvent(event_4, dragonBones.EventObject.FADE_IN_COMPLETE);
                        }
                    }
                }
            }
        };
        /**
         * @private
         */
        AnimationState.prototype._isDisabled = function (slot) {
            if (this.displayControl &&
                (!slot.displayController ||
                    slot.displayController == this._name ||
                    slot.displayController == this._group)) {
                return false;
            }
            return true;
        };
        /**
         * @private
         */
        AnimationState.prototype._fadeIn = function (armature, clip, animationName, playTimes, position, duration, time, timeScale, fadeInTime, pausePlayhead) {
            this._armature = armature;
            this._animationData = clip;
            this._name = animationName;
            this.playTimes = playTimes;
            this.timeScale = timeScale;
            this.fadeTotalTime = fadeInTime;
            this._position = position;
            this._duration = duration;
            this._time = time;
            this._isPausePlayhead = pausePlayhead;
            if (this.fadeTotalTime == 0) {
                this._fadeProgress = 0.999999;
            }
            this._timeline = dragonBones.BaseObject.borrowObject(dragonBones.AnimationTimelineState);
            this._timeline.fadeIn(this._armature, this, this._animationData, this._time);
            this._updateTimelineStates();
        };
        /**
         * @private
         */
        AnimationState.prototype._updateTimelineStates = function () {
            var time = this._time;
            if (!this._animationData.hasAsynchronyTimeline) {
                time = this._timeline._currentTime;
            }
            var boneTimelineStates = {};
            var slotTimelineStates = {};
            for (var i = 0, l = this._boneTimelines.length; i < l; ++i) {
                var boneTimelineState = this._boneTimelines[i];
                boneTimelineStates[boneTimelineState.bone.name] = boneTimelineState;
            }
            var bones = this._armature.getBones();
            for (var i = 0, l = bones.length; i < l; ++i) {
                var bone = bones[i];
                var boneTimelineName = bone.name;
                var boneTimelineData = this._animationData.getBoneTimeline(boneTimelineName);
                if (boneTimelineData && this.containsBoneMask(boneTimelineName)) {
                    var boneTimelineState = boneTimelineStates[boneTimelineName];
                    if (boneTimelineState) {
                        delete boneTimelineStates[boneTimelineName];
                    }
                    else {
                        boneTimelineState = dragonBones.BaseObject.borrowObject(dragonBones.BoneTimelineState);
                        boneTimelineState.bone = bone;
                        boneTimelineState.fadeIn(this._armature, this, boneTimelineData, time);
                        this._boneTimelines.push(boneTimelineState);
                    }
                }
            }
            for (var i in boneTimelineStates) {
                var boneTimelineState = boneTimelineStates[i];
                boneTimelineState.bone.invalidUpdate();
                this._boneTimelines.splice(this._boneTimelines.indexOf(boneTimelineState), 1);
                boneTimelineState.returnToPool();
            }
            //
            for (var i = 0, l = this._slotTimelines.length; i < l; ++i) {
                var slotTimelineState = this._slotTimelines[i];
                slotTimelineStates[slotTimelineState.slot.name] = slotTimelineState;
            }
            var slots = this._armature.getSlots();
            for (var i = 0, l = slots.length; i < l; ++i) {
                var slot = slots[i];
                var slotTimelineName = slot.name;
                var parentTimelineName = slot.parent.name;
                var slotTimelineData = this._animationData.getSlotTimeline(slotTimelineName);
                if (slotTimelineData && this.containsBoneMask(parentTimelineName) && !this._isFadeOut) {
                    var slotTimelineState = slotTimelineStates[slotTimelineName];
                    if (slotTimelineState) {
                        delete slotTimelineStates[slotTimelineName];
                    }
                    else {
                        slotTimelineState = dragonBones.BaseObject.borrowObject(dragonBones.SlotTimelineState);
                        slotTimelineState.slot = slot;
                        slotTimelineState.fadeIn(this._armature, this, slotTimelineData, time);
                        this._slotTimelines.push(slotTimelineState);
                    }
                }
            }
            for (var i in slotTimelineStates) {
                var slotTimelineState = slotTimelineStates[i];
                this._slotTimelines.splice(this._slotTimelines.indexOf(slotTimelineState), 1);
                slotTimelineState.returnToPool();
            }
            this._updateFFDTimelineStates();
        };
        /**
         * @private
         */
        AnimationState.prototype._updateFFDTimelineStates = function () {
            var time = this._time;
            if (!this._animationData.hasAsynchronyTimeline) {
                time = this._timeline._currentTime;
            }
            var ffdTimelineStates = {};
            for (var i = 0, l = this._ffdTimelines.length; i < l; ++i) {
                var ffdTimelineState = this._ffdTimelines[i];
                ffdTimelineStates[ffdTimelineState.slot.name] = ffdTimelineState;
            }
            var slots = this._armature.getSlots();
            for (var i = 0, l = slots.length; i < l; ++i) {
                var slot = slots[i];
                var slotTimelineName = slot.name;
                var parentTimelineName = slot.parent.name;
                if (slot._meshData) {
                    var ffdTimelineData = this._animationData.getFFDTimeline(this._armature._skinData.name, slotTimelineName, slot.displayIndex);
                    if (ffdTimelineData && this.containsBoneMask(parentTimelineName)) {
                        var ffdTimelineState = ffdTimelineStates[slotTimelineName];
                        if (ffdTimelineState) {
                            delete ffdTimelineStates[slotTimelineName];
                        }
                        else {
                            ffdTimelineState = dragonBones.BaseObject.borrowObject(dragonBones.FFDTimelineState);
                            ffdTimelineState.slot = slot;
                            ffdTimelineState.fadeIn(this._armature, this, ffdTimelineData, time);
                            this._ffdTimelines.push(ffdTimelineState);
                        }
                    }
                    else {
                        for (var iF = 0, lF = slot._ffdVertices.length; iF < lF; ++iF) {
                            slot._ffdVertices[iF] = 0;
                        }
                        slot._ffdDirty = true;
                    }
                }
            }
            for (var i in ffdTimelineStates) {
                var ffdTimelineState = ffdTimelineStates[i];
                ffdTimelineState.slot._ffdDirty = true;
                this._ffdTimelines.splice(this._ffdTimelines.indexOf(ffdTimelineState), 1);
                ffdTimelineState.returnToPool();
            }
        };
        /**
         * @private
         */
        AnimationState.prototype._advanceTime = function (passedTime, weightLeft, index) {
            if (passedTime != 0) {
                this._advanceFadeTime(passedTime);
            }
            this._weightResult = this.weight * this._fadeProgress * weightLeft;
            passedTime *= this.timeScale;
            if (passedTime != 0 && this._isPlaying && !this._isPausePlayhead) {
                this._time += passedTime;
            }
            if (this._weightResult != 0) {
                var cacheFrameIndex = (this._fadeProgress >= 1 && index == 0 && this._armature.cacheFrameRate > 0) ? Math.floor(this._timeline._currentTime * this._animationData.cacheTimeToFrameScale) : -1;
                var isUpdatesTimeline = true;
                var isUpdatesBoneTimeline = true;
                var time = cacheFrameIndex < 0 ? this._time : (cacheFrameIndex / this._animationData.cacheTimeToFrameScale);
                this._timeline.update(this._time);
                if (!this._animationData.hasAsynchronyTimeline) {
                    time = this._timeline._currentTime;
                }
                if (cacheFrameIndex >= 0) {
                    if (this._armature._cacheFrameIndex == cacheFrameIndex) {
                        isUpdatesTimeline = false;
                        isUpdatesBoneTimeline = false;
                    }
                    else {
                        this._armature._cacheFrameIndex = cacheFrameIndex;
                        if (this._armature._animation._animationStateDirty) {
                            this._armature._animation._animationStateDirty = false;
                            for (var i = 0, l = this._boneTimelines.length; i < l; ++i) {
                                var boneTimeline = this._boneTimelines[i];
                                boneTimeline.bone._cacheFrames = boneTimeline._timeline.cachedFrames;
                            }
                            for (var i = 0, l = this._slotTimelines.length; i < l; ++i) {
                                var slotTimeline = this._slotTimelines[i];
                                slotTimeline.slot._cacheFrames = slotTimeline._timeline.cachedFrames;
                            }
                        }
                        if (this._animationData.cachedFrames[cacheFrameIndex]) {
                            isUpdatesBoneTimeline = false;
                        }
                        else {
                            this._animationData.cachedFrames[cacheFrameIndex] = true;
                        }
                    }
                }
                else {
                    this._armature._cacheFrameIndex = -1;
                }
                if (isUpdatesTimeline) {
                    if (isUpdatesBoneTimeline) {
                        for (var i = 0, l = this._boneTimelines.length; i < l; ++i) {
                            this._boneTimelines[i].update(time);
                        }
                    }
                    for (var i = 0, l = this._slotTimelines.length; i < l; ++i) {
                        this._slotTimelines[i].update(time);
                    }
                    for (var i = 0, l = this._ffdTimelines.length; i < l; ++i) {
                        this._ffdTimelines[i].update(time);
                    }
                }
            }
            if (this.autoFadeOutTime >= 0 && this._fadeProgress >= 1 && this._timeline._isCompleted) {
                this.fadeOut(this.autoFadeOutTime);
            }
        };
        /**
         * @language zh_CN
         * 继续播放。
         * @version DragonBones 3.0
         */
        AnimationState.prototype.play = function () {
            this._isPlaying = true;
        };
        /**
         * @language zh_CN
         * 暂停播放。
         * @version DragonBones 3.0
         */
        AnimationState.prototype.stop = function () {
            this._isPlaying = false;
        };
        /**
         * @language zh_CN
         * 淡出动画。
         * @param fadeOutTime 淡出时间。 (以秒为单位)
         * @param pausePlayhead 淡出时是否暂停动画。 [true: 暂停, false: 不暂停]
         * @version DragonBones 3.0
         */
        AnimationState.prototype.fadeOut = function (fadeOutTime, pausePlayhead) {
            if (pausePlayhead === void 0) { pausePlayhead = true; }
            if (fadeOutTime < 0 || fadeOutTime != fadeOutTime) {
                fadeOutTime = 0;
            }
            this._isPausePlayhead = pausePlayhead;
            if (this._isFadeOut) {
                if (fadeOutTime > fadeOutTime - this._fadeTime) {
                    // If the animation is already in fade out, the new fade out will be ignored.
                    return;
                }
            }
            else {
                this._isFadeOut = true;
                if (fadeOutTime == 0 || this._fadeProgress <= 0) {
                    this._fadeProgress = 0.000001;
                }
                for (var i = 0, l = this._boneTimelines.length; i < l; ++i) {
                    this._boneTimelines[i].fadeOut();
                }
                for (var i = 0, l = this._slotTimelines.length; i < l; ++i) {
                    this._slotTimelines[i].fadeOut();
                }
            }
            this.displayControl = false;
            this.fadeTotalTime = this._fadeProgress > 0.000001 ? fadeOutTime / this._fadeProgress : 0;
            this._fadeTime = this.fadeTotalTime * (1 - this._fadeProgress);
        };
        /**
         * @language zh_CN
         * 是否包含指定的骨骼遮罩。
         * @param name 指定的骨骼名称。
         * @version DragonBones 3.0
         */
        AnimationState.prototype.containsBoneMask = function (name) {
            return !this._boneMask.length || this._boneMask.indexOf(name) >= 0;
        };
        /**
         * @language zh_CN
         * 添加指定的骨骼遮罩。
         * @param boneName 指定的骨骼名称。
         * @param recursive 是否为该骨骼的子骨骼添加遮罩。
         * @version DragonBones 3.0
         */
        AnimationState.prototype.addBoneMask = function (name, recursive) {
            if (recursive === void 0) { recursive = true; }
            var currentBone = this._armature.getBone(name);
            if (!currentBone) {
                return;
            }
            if (this._boneMask.indexOf(name) < 0 &&
                this._animationData.getBoneTimeline(name)) {
                this._boneMask.push(name);
            }
            if (recursive) {
                var bones = this._armature.getBones();
                for (var i = 0, l = bones.length; i < l; ++i) {
                    var bone = bones[i];
                    var boneName = bone.name;
                    if (this._boneMask.indexOf(boneName) < 0 &&
                        this._animationData.getBoneTimeline(boneName) &&
                        currentBone.contains(bone)) {
                        this._boneMask.push(boneName);
                    }
                }
            }
            this._updateTimelineStates();
        };
        /**
         * @language zh_CN
         * 删除指定的骨骼遮罩。
         * @param boneName 指定的骨骼名称。
         * @param recursive 是否删除该骨骼的子骨骼遮罩。
         * @version DragonBones 3.0
         */
        AnimationState.prototype.removeBoneMask = function (name, recursive) {
            if (recursive === void 0) { recursive = true; }
            var index = this._boneMask.indexOf(name);
            if (index >= 0) {
                this._boneMask.splice(index, 1);
            }
            if (recursive) {
                var currentBone = this._armature.getBone(name);
                if (currentBone) {
                    var bones = this._armature.getBones();
                    for (var i = 0, l = bones.length; i < l; ++i) {
                        var bone = bones[i];
                        var boneName = bone.name;
                        var index_1 = this._boneMask.indexOf(boneName);
                        if (index_1 >= 0 &&
                            currentBone.contains(bone)) {
                            this._boneMask.splice(index_1, 1);
                        }
                    }
                }
            }
            this._updateTimelineStates();
        };
        /**
         * @language zh_CN
         * 删除所有骨骼遮罩。
         * @version DragonBones 3.0
         */
        AnimationState.prototype.removeAllBoneMask = function () {
            this._boneMask.length = 0;
            this._updateTimelineStates();
        };
        Object.defineProperty(AnimationState.prototype, "layer", {
            /**
             * @language zh_CN
             * 动画图层。
             * @see dragonBones.Animation#fadeIn()
             * @version DragonBones 3.0
             */
            get: function () {
                return this._layer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "group", {
            /**
             * @language zh_CN
             * 动画组。
             * @see dragonBones.Animation#fadeIn()
             * @version DragonBones 3.0
             */
            get: function () {
                return this._group;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "name", {
            /**
             * @language zh_CN
             * 动画名称。
             * @see dragonBones.AnimationData#name
             * @version DragonBones 3.0
             */
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "animationData", {
            /**
             * @language zh_CN
             * 动画数据。
             * @see dragonBones.AnimationData
             * @version DragonBones 3.0
             */
            get: function () {
                return this._animationData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "isCompleted", {
            /**
             * @language zh_CN
             * 是否播放完毕。
             * @version DragonBones 3.0
             */
            get: function () {
                return this._timeline._isCompleted;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "isPlaying", {
            /**
             * @language zh_CN
             * 是否正在播放。
             * @version DragonBones 3.0
             */
            get: function () {
                return (this._isPlaying && !this._timeline._isCompleted);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "currentPlayTimes", {
            /**
             * @language zh_CN
             * 当前动画的播放次数。
             * @version DragonBones 3.0
             */
            get: function () {
                return this._currentPlayTimes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "totalTime", {
            /**
             * @language zh_CN
             * 当前动画的总时间。 (以秒为单位)
             * @version DragonBones 3.0
             */
            get: function () {
                return this._duration;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "currentTime", {
            /**
             * @language zh_CN
             * 当前动画的播放时间。 (以秒为单位)
             * @version DragonBones 3.0
             */
            get: function () {
                return this._timeline._currentTime;
            },
            set: function (value) {
                if (value < 0 || value != value) {
                    value = 0;
                }
                this._time = value;
                this._timeline.setCurrentTime(this._time);
                if (this._weightResult != 0) {
                    var time = this._time;
                    if (!this._animationData.hasAsynchronyTimeline) {
                        time = this._timeline._currentTime;
                    }
                    for (var i = 0, l = this._boneTimelines.length; i < l; ++i) {
                        this._boneTimelines[i].setCurrentTime(time);
                    }
                    for (var i = 0, l = this._slotTimelines.length; i < l; ++i) {
                        this._slotTimelines[i].setCurrentTime(time);
                    }
                    for (var i = 0, l = this._ffdTimelines.length; i < l; ++i) {
                        this._ffdTimelines[i].setCurrentTime(time);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "clip", {
            /**
             * @deprecated
             * @see #animationData
             * @version DragonBones 3.0
             */
            get: function () {
                return this._animationData;
            },
            enumerable: true,
            configurable: true
        });
        return AnimationState;
    }(dragonBones.BaseObject));
    dragonBones.AnimationState = AnimationState;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    var AnimationTimelineState = (function (_super) {
        __extends(AnimationTimelineState, _super);
        function AnimationTimelineState() {
            _super.call(this);
        }
        AnimationTimelineState.toString = function () {
            return "[Class dragonBones.AnimationTimelineState]";
        };
        /**
         * @inheritDoc
         */
        AnimationTimelineState.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this._isStarted = false;
        };
        AnimationTimelineState.prototype._onCrossFrame = function (frame) {
            var actions = frame.actions;
            for (var i = 0, l = actions.length; i < l; ++i) {
                var actionData = actions[i];
                if (actionData.slot) {
                    var slot = this._armature.getSlot(actionData.slot.name);
                    if (slot) {
                        var childArmature = slot.childArmature;
                        if (childArmature) {
                            childArmature._action = actionData;
                        }
                    }
                }
                else if (actionData.bone) {
                    var slots = this._armature.getSlots();
                    for (var i_4 = 0, l_3 = slots.length; i_4 < l_3; ++i_4) {
                        var eachChildArmature = slots[i_4].childArmature;
                        if (eachChildArmature) {
                            eachChildArmature._action = actionData;
                        }
                    }
                }
                else {
                    this._armature._action = actionData;
                }
            }
            var eventDispatcher = this._armature._display;
            var events = frame.events;
            for (var i = 0, l = events.length; i < l; ++i) {
                var eventData = events[i];
                var eventType = "";
                switch (eventData.type) {
                    case 0 /* Frame */:
                        eventType = dragonBones.EventObject.FRAME_EVENT;
                        break;
                    case 1 /* Sound */:
                        eventType = dragonBones.EventObject.SOUND_EVENT;
                        break;
                }
                if (eventDispatcher.hasEvent(eventType)) {
                    var eventObject = dragonBones.BaseObject.borrowObject(dragonBones.EventObject);
                    eventObject.animationState = this._animationState;
                    if (eventData.bone) {
                        eventObject.bone = this._armature.getBone(eventData.bone.name);
                    }
                    if (eventData.slot) {
                        eventObject.slot = this._armature.getSlot(eventData.slot.name);
                    }
                    eventObject.name = eventData.name;
                    eventObject.data = eventData.data;
                    this._armature._bufferEvent(eventObject, eventType);
                }
            }
        };
        AnimationTimelineState.prototype.update = function (time) {
            var prevPlayTimes = this._currentPlayTimes;
            var eventDispatcher = this._armature._display;
            if (!this._isStarted && time != 0) {
                this._isStarted = true;
                if (eventDispatcher.hasEvent(dragonBones.EventObject.START)) {
                    var eventObject = dragonBones.BaseObject.borrowObject(dragonBones.EventObject);
                    eventObject.animationState = this._animationState;
                    this._armature._bufferEvent(eventObject, dragonBones.EventObject.START);
                }
            }
            _super.prototype.update.call(this, time);
            if (prevPlayTimes != this._currentPlayTimes) {
                var eventType = this._isCompleted ? dragonBones.EventObject.COMPLETE : dragonBones.EventObject.LOOP_COMPLETE;
                if (eventDispatcher.hasEvent(eventType)) {
                    var eventObject = dragonBones.BaseObject.borrowObject(dragonBones.EventObject);
                    eventObject.animationState = this._animationState;
                    this._armature._bufferEvent(eventObject, eventType);
                }
            }
        };
        return AnimationTimelineState;
    }(dragonBones.TimelineState));
    dragonBones.AnimationTimelineState = AnimationTimelineState;
    /**
     * @private
     */
    var BoneTimelineState = (function (_super) {
        __extends(BoneTimelineState, _super);
        function BoneTimelineState() {
            _super.call(this);
            this._transform = new dragonBones.Transform();
            this._currentTransform = new dragonBones.Transform();
            this._durationTransform = new dragonBones.Transform();
        }
        BoneTimelineState.toString = function () {
            return "[Class dragonBones.BoneTimelineState]";
        };
        /**
         * @inheritDoc
         */
        BoneTimelineState.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.bone = null;
            this._tweenTransform = 0 /* None */;
            this._tweenRotate = 0 /* None */;
            this._tweenScale = 0 /* None */;
            this._boneTransform = null;
            this._originTransform = null;
            this._transform.identity();
            this._currentTransform.identity();
            this._durationTransform.identity();
        };
        BoneTimelineState.prototype._onFadeIn = function () {
            this._originTransform = this._timeline.originTransform;
            this._boneTransform = this.bone._animationPose;
        };
        BoneTimelineState.prototype._onArriveAtFrame = function (isUpdate) {
            _super.prototype._onArriveAtFrame.call(this, isUpdate);
            this._currentTransform.copyFrom(this._currentFrame.transform);
            this._tweenTransform = 1 /* Once */;
            this._tweenRotate = 1 /* Once */;
            this._tweenScale = 1 /* Once */;
            if (this._keyFrameCount > 1 && (this._tweenEasing != dragonBones.DragonBones.NO_TWEEN || this._curve)) {
                var nextFrame = this._currentFrame.next;
                var nextTransform = nextFrame.transform;
                // Transform.
                this._durationTransform.x = nextTransform.x - this._currentTransform.x;
                this._durationTransform.y = nextTransform.y - this._currentTransform.y;
                if (this._durationTransform.x != 0 || this._durationTransform.y != 0) {
                    this._tweenTransform = 2 /* Always */;
                }
                // Rotate.
                var tweenRotate = this._currentFrame.tweenRotate;
                if (tweenRotate == tweenRotate) {
                    if (tweenRotate) {
                        if (tweenRotate > 0 ? nextTransform.skewY >= this._currentTransform.skewY : nextTransform.skewY <= this._currentTransform.skewY) {
                            var rotate = tweenRotate > 0 ? tweenRotate - 1 : tweenRotate + 1;
                            this._durationTransform.skewX = nextTransform.skewX - this._currentTransform.skewX + dragonBones.DragonBones.PI_D * rotate;
                            this._durationTransform.skewY = nextTransform.skewY - this._currentTransform.skewY + dragonBones.DragonBones.PI_D * rotate;
                        }
                        else {
                            this._durationTransform.skewX = nextTransform.skewX - this._currentTransform.skewX + dragonBones.DragonBones.PI_D * tweenRotate;
                            this._durationTransform.skewY = nextTransform.skewY - this._currentTransform.skewY + dragonBones.DragonBones.PI_D * tweenRotate;
                        }
                    }
                    else {
                        this._durationTransform.skewX = dragonBones.Transform.normalizeRadian(nextTransform.skewX - this._currentTransform.skewX);
                        this._durationTransform.skewY = dragonBones.Transform.normalizeRadian(nextTransform.skewY - this._currentTransform.skewY);
                    }
                    if (this._durationTransform.skewX != 0 || this._durationTransform.skewY != 0) {
                        this._tweenRotate = 2 /* Always */;
                    }
                }
                else {
                    this._durationTransform.skewX = 0;
                    this._durationTransform.skewY = 0;
                }
                // Scale.
                if (this._currentFrame.tweenScale) {
                    this._durationTransform.scaleX = nextTransform.scaleX - this._currentTransform.scaleX;
                    this._durationTransform.scaleY = nextTransform.scaleY - this._currentTransform.scaleY;
                    if (this._durationTransform.scaleX != 0 || this._durationTransform.scaleY != 0) {
                        this._tweenScale = 2 /* Always */;
                    }
                }
                else {
                    this._durationTransform.scaleX = 0;
                    this._durationTransform.scaleY = 0;
                }
            }
            else {
                this._durationTransform.x = 0;
                this._durationTransform.y = 0;
                this._durationTransform.skewX = 0;
                this._durationTransform.skewY = 0;
                this._durationTransform.scaleX = 0;
                this._durationTransform.scaleY = 0;
            }
        };
        BoneTimelineState.prototype._onUpdateFrame = function (isUpdate) {
            if (this._tweenTransform || this._tweenRotate || this._tweenScale) {
                _super.prototype._onUpdateFrame.call(this, isUpdate);
                if (this._tweenTransform) {
                    if (this._tweenTransform == 1 /* Once */) {
                        this._tweenTransform = 0 /* None */;
                    }
                    if (this._animationState.additiveBlending) {
                        this._transform.x = this._currentTransform.x + this._durationTransform.x * this._tweenProgress;
                        this._transform.y = this._currentTransform.y + this._durationTransform.y * this._tweenProgress;
                    }
                    else {
                        this._transform.x = this._originTransform.x + this._currentTransform.x + this._durationTransform.x * this._tweenProgress;
                        this._transform.y = this._originTransform.y + this._currentTransform.y + this._durationTransform.y * this._tweenProgress;
                    }
                }
                if (this._tweenRotate) {
                    if (this._tweenRotate == 1 /* Once */) {
                        this._tweenRotate = 0 /* None */;
                    }
                    if (this._animationState.additiveBlending) {
                        this._transform.skewX = this._currentTransform.skewX + this._durationTransform.skewX * this._tweenProgress;
                        this._transform.skewY = this._currentTransform.skewY + this._durationTransform.skewY * this._tweenProgress;
                    }
                    else {
                        this._transform.skewX = this._originTransform.skewX + this._currentTransform.skewX + this._durationTransform.skewX * this._tweenProgress;
                        this._transform.skewY = this._originTransform.skewY + this._currentTransform.skewY + this._durationTransform.skewY * this._tweenProgress;
                    }
                }
                if (this._tweenScale) {
                    if (this._tweenScale == 1 /* Once */) {
                        this._tweenScale = 0 /* None */;
                    }
                    if (this._animationState.additiveBlending) {
                        this._transform.scaleX = this._currentTransform.scaleX + this._durationTransform.scaleX * this._tweenProgress;
                        this._transform.scaleY = this._currentTransform.scaleY + this._durationTransform.scaleY * this._tweenProgress;
                    }
                    else {
                        this._transform.scaleX = this._originTransform.scaleX * (this._currentTransform.scaleX + this._durationTransform.scaleX * this._tweenProgress);
                        this._transform.scaleY = this._originTransform.scaleY * (this._currentTransform.scaleY + this._durationTransform.scaleY * this._tweenProgress);
                    }
                }
                this.bone.invalidUpdate();
            }
        };
        BoneTimelineState.prototype.fadeOut = function () {
            this._transform.skewX = dragonBones.Transform.normalizeRadian(this._transform.skewX);
            this._transform.skewY = dragonBones.Transform.normalizeRadian(this._transform.skewY);
        };
        BoneTimelineState.prototype.update = function (time) {
            _super.prototype.update.call(this, time);
            // Blend animation state.
            var weight = this._animationState._weightResult;
            if (weight > 0) {
                if (this.bone._blendIndex == 0) {
                    this._boneTransform.x = this._transform.x * weight;
                    this._boneTransform.y = this._transform.y * weight;
                    this._boneTransform.skewX = this._transform.skewX * weight;
                    this._boneTransform.skewY = this._transform.skewY * weight;
                    this._boneTransform.scaleX = (this._transform.scaleX - 1) * weight + 1;
                    this._boneTransform.scaleY = (this._transform.scaleY - 1) * weight + 1;
                }
                else {
                    this._boneTransform.x += this._transform.x * weight;
                    this._boneTransform.y += this._transform.y * weight;
                    this._boneTransform.skewX += this._transform.skewX * weight;
                    this._boneTransform.skewY += this._transform.skewY * weight;
                    this._boneTransform.scaleX += (this._transform.scaleX - 1) * weight;
                    this._boneTransform.scaleY += (this._transform.scaleY - 1) * weight;
                }
                this.bone._blendIndex++;
                var fadeProgress = this._animationState._fadeProgress;
                if (fadeProgress < 1) {
                    this.bone.invalidUpdate();
                }
            }
        };
        return BoneTimelineState;
    }(dragonBones.TweenTimelineState));
    dragonBones.BoneTimelineState = BoneTimelineState;
    /**
     * @private
     */
    var SlotTimelineState = (function (_super) {
        __extends(SlotTimelineState, _super);
        function SlotTimelineState() {
            _super.call(this);
            this._color = new dragonBones.ColorTransform();
            this._durationColor = new dragonBones.ColorTransform();
        }
        SlotTimelineState.toString = function () {
            return "[Class dragonBones.SlotTimelineState]";
        };
        /**
         * @inheritDoc
         */
        SlotTimelineState.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.slot = null;
            this._colorDirty = false;
            this._tweenColor = 0 /* None */;
            this._slotColor = null;
            this._color.identity();
            this._durationColor.identity();
        };
        SlotTimelineState.prototype._onFadeIn = function () {
            this._slotColor = this.slot._colorTransform;
        };
        SlotTimelineState.prototype._onArriveAtFrame = function (isUpdate) {
            _super.prototype._onArriveAtFrame.call(this, isUpdate);
            if (this._animationState._isDisabled(this.slot)) {
                this._tweenEasing = dragonBones.DragonBones.NO_TWEEN;
                this._curve = null;
                this._tweenColor = 0 /* None */;
                return;
            }
            if (this.slot._displayDataSet) {
                var displayIndex = this._currentFrame.displayIndex;
                if (this.slot.displayIndex >= 0 && displayIndex >= 0) {
                    if (this.slot._displayDataSet.displays.length > 1) {
                        this.slot._setDisplayIndex(displayIndex);
                    }
                }
                else {
                    this.slot._setDisplayIndex(displayIndex);
                }
                this.slot._updateMeshData(true);
            }
            if (this._currentFrame.displayIndex >= 0) {
                this._tweenColor = 0 /* None */;
                var currentColor = this._currentFrame.color;
                if (this._keyFrameCount > 1 && (this._tweenEasing != dragonBones.DragonBones.NO_TWEEN || this._curve)) {
                    var nextFrame = this._currentFrame.next;
                    var nextColor = nextFrame.color;
                    if (currentColor != nextColor && nextFrame.displayIndex >= 0) {
                        this._durationColor.alphaMultiplier = nextColor.alphaMultiplier - currentColor.alphaMultiplier;
                        this._durationColor.redMultiplier = nextColor.redMultiplier - currentColor.redMultiplier;
                        this._durationColor.greenMultiplier = nextColor.greenMultiplier - currentColor.greenMultiplier;
                        this._durationColor.blueMultiplier = nextColor.blueMultiplier - currentColor.blueMultiplier;
                        this._durationColor.alphaOffset = nextColor.alphaOffset - currentColor.alphaOffset;
                        this._durationColor.redOffset = nextColor.redOffset - currentColor.redOffset;
                        this._durationColor.greenOffset = nextColor.greenOffset - currentColor.greenOffset;
                        this._durationColor.blueOffset = nextColor.blueOffset - currentColor.blueOffset;
                        if (this._durationColor.alphaMultiplier != 0 ||
                            this._durationColor.redMultiplier != 0 ||
                            this._durationColor.greenMultiplier != 0 ||
                            this._durationColor.blueMultiplier != 0 ||
                            this._durationColor.alphaOffset != 0 ||
                            this._durationColor.redOffset != 0 ||
                            this._durationColor.greenOffset != 0 ||
                            this._durationColor.blueOffset != 0) {
                            this._tweenColor = 2 /* Always */;
                        }
                    }
                }
                if (this._tweenColor == 0 /* None */) {
                    this._durationColor.alphaMultiplier = currentColor.alphaMultiplier - this._slotColor.alphaMultiplier;
                    this._durationColor.redMultiplier = currentColor.redMultiplier - this._slotColor.redMultiplier;
                    this._durationColor.greenMultiplier = currentColor.greenMultiplier - this._slotColor.greenMultiplier;
                    this._durationColor.blueMultiplier = currentColor.blueMultiplier - this._slotColor.blueMultiplier;
                    this._durationColor.alphaOffset = currentColor.alphaOffset - this._slotColor.alphaOffset;
                    this._durationColor.redOffset = currentColor.redOffset - this._slotColor.redOffset;
                    this._durationColor.greenOffset = currentColor.greenOffset - this._slotColor.greenOffset;
                    this._durationColor.blueOffset = currentColor.blueOffset - this._slotColor.blueOffset;
                    if (this._durationColor.alphaMultiplier != 0 ||
                        this._durationColor.redMultiplier != 0 ||
                        this._durationColor.greenMultiplier != 0 ||
                        this._durationColor.blueMultiplier != 0 ||
                        this._durationColor.alphaOffset != 0 ||
                        this._durationColor.redOffset != 0 ||
                        this._durationColor.greenOffset != 0 ||
                        this._durationColor.blueOffset != 0) {
                        this._tweenColor = 1 /* Once */;
                    }
                }
            }
            else {
                this._tweenEasing = dragonBones.DragonBones.NO_TWEEN;
                this._curve = null;
                this._tweenColor = 0 /* None */;
            }
        };
        SlotTimelineState.prototype._onUpdateFrame = function (isUpdate) {
            _super.prototype._onUpdateFrame.call(this, isUpdate);
            if (this._tweenColor) {
                if (this._tweenColor == 1 /* Once */) {
                    this._tweenColor = 0 /* None */;
                }
                var currentColor = this._currentFrame.color;
                this._color.alphaMultiplier = currentColor.alphaMultiplier + this._durationColor.alphaMultiplier * this._tweenProgress;
                this._color.redMultiplier = currentColor.redMultiplier + this._durationColor.redMultiplier * this._tweenProgress;
                this._color.greenMultiplier = currentColor.greenMultiplier + this._durationColor.greenMultiplier * this._tweenProgress;
                this._color.blueMultiplier = currentColor.blueMultiplier + this._durationColor.blueMultiplier * this._tweenProgress;
                this._color.alphaOffset = currentColor.alphaOffset + this._durationColor.alphaOffset * this._tweenProgress;
                this._color.redOffset = currentColor.redOffset + this._durationColor.redOffset * this._tweenProgress;
                this._color.greenOffset = currentColor.greenOffset + this._durationColor.greenOffset * this._tweenProgress;
                this._color.blueOffset = currentColor.blueOffset + this._durationColor.blueOffset * this._tweenProgress;
                this._colorDirty = true;
            }
        };
        SlotTimelineState.prototype.fadeOut = function () {
            this._tweenColor = 0 /* None */;
        };
        SlotTimelineState.prototype.update = function (time) {
            _super.prototype.update.call(this, time);
            // Fade animation.
            if (this._tweenColor != 0 /* None */ || this._colorDirty) {
                var weight = this._animationState._weightResult;
                if (weight > 0) {
                    var fadeProgress = this._animationState._fadeProgress;
                    if (fadeProgress < 1) {
                        this._slotColor.alphaMultiplier += (this._color.alphaMultiplier - this._slotColor.alphaMultiplier) * fadeProgress;
                        this._slotColor.redMultiplier += (this._color.redMultiplier - this._slotColor.redMultiplier) * fadeProgress;
                        this._slotColor.greenMultiplier += (this._color.greenMultiplier - this._slotColor.greenMultiplier) * fadeProgress;
                        this._slotColor.blueMultiplier += (this._color.blueMultiplier - this._slotColor.blueMultiplier) * fadeProgress;
                        this._slotColor.alphaOffset += (this._color.alphaOffset - this._slotColor.alphaOffset) * fadeProgress;
                        this._slotColor.redOffset += (this._color.redOffset - this._slotColor.redOffset) * fadeProgress;
                        this._slotColor.greenOffset += (this._color.greenOffset - this._slotColor.greenOffset) * fadeProgress;
                        this._slotColor.blueOffset += (this._color.blueOffset - this._slotColor.blueOffset) * fadeProgress;
                        this.slot._colorDirty = true;
                    }
                    else if (this._colorDirty) {
                        this._colorDirty = false;
                        this._slotColor.alphaMultiplier = this._color.alphaMultiplier;
                        this._slotColor.redMultiplier = this._color.redMultiplier;
                        this._slotColor.greenMultiplier = this._color.greenMultiplier;
                        this._slotColor.blueMultiplier = this._color.blueMultiplier;
                        this._slotColor.alphaOffset = this._color.alphaOffset;
                        this._slotColor.redOffset = this._color.redOffset;
                        this._slotColor.greenOffset = this._color.greenOffset;
                        this._slotColor.blueOffset = this._color.blueOffset;
                        this.slot._colorDirty = true;
                    }
                }
            }
        };
        return SlotTimelineState;
    }(dragonBones.TweenTimelineState));
    dragonBones.SlotTimelineState = SlotTimelineState;
    /**
     * @private
     */
    var FFDTimelineState = (function (_super) {
        __extends(FFDTimelineState, _super);
        function FFDTimelineState() {
            _super.call(this);
            this._ffdVertices = [];
        }
        FFDTimelineState.toString = function () {
            return "[Class dragonBones.FFDTimelineState]";
        };
        /**
         * @inheritDoc
         */
        FFDTimelineState.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.slot = null;
            this._tweenFFD = 0 /* None */;
            this._slotFFDVertices = null;
            if (this._durationFFDFrame) {
                this._durationFFDFrame.returnToPool();
                this._durationFFDFrame = null;
            }
            if (this._ffdVertices.length) {
                this._ffdVertices.length = 0;
            }
        };
        FFDTimelineState.prototype._onFadeIn = function () {
            this._slotFFDVertices = this.slot._ffdVertices;
            this._durationFFDFrame = dragonBones.BaseObject.borrowObject(dragonBones.ExtensionFrameData);
            this._durationFFDFrame.tweens.length = this._slotFFDVertices.length;
            this._ffdVertices.length = this._slotFFDVertices.length;
            for (var i = 0, l = this._durationFFDFrame.tweens.length; i < l; ++i) {
                this._durationFFDFrame.tweens[i] = 0;
            }
            for (var i = 0, l = this._ffdVertices.length; i < l; ++i) {
                this._ffdVertices[i] = 0;
            }
        };
        FFDTimelineState.prototype._onArriveAtFrame = function (isUpdate) {
            _super.prototype._onArriveAtFrame.call(this, isUpdate);
            this._tweenFFD = 0 /* None */;
            if (this._tweenEasing != dragonBones.DragonBones.NO_TWEEN || this._curve) {
                this._tweenFFD = this._updateExtensionKeyFrame(this._currentFrame, this._currentFrame.next, this._durationFFDFrame);
            }
            if (this._tweenFFD == 0 /* None */) {
                var currentFFDVertices = this._currentFrame.tweens;
                for (var i = 0, l = currentFFDVertices.length; i < l; ++i) {
                    if (this._slotFFDVertices[i] != currentFFDVertices[i]) {
                        this._tweenFFD = 1 /* Once */;
                        break;
                    }
                }
            }
        };
        FFDTimelineState.prototype._onUpdateFrame = function (isUpdate) {
            _super.prototype._onUpdateFrame.call(this, isUpdate);
            if (this._tweenFFD != 0 /* None */) {
                if (this._tweenFFD == 1 /* Once */) {
                    this._tweenFFD = 0 /* None */;
                }
                var currentFFDVertices = this._currentFrame.tweens;
                var nextFFDVertices = this._durationFFDFrame.tweens;
                for (var i = 0, l = currentFFDVertices.length; i < l; ++i) {
                    this._ffdVertices[i] = currentFFDVertices[i] + nextFFDVertices[i] * this._tweenProgress;
                }
                this.slot._ffdDirty = true;
            }
        };
        FFDTimelineState.prototype.update = function (time) {
            _super.prototype.update.call(this, time);
            // Blend animation.
            var weight = this._animationState._weightResult;
            if (weight > 0) {
                if (this.slot._blendIndex == 0) {
                    for (var i = 0, l = this._ffdVertices.length; i < l; ++i) {
                        this._slotFFDVertices[i] = this._ffdVertices[i] * weight;
                    }
                }
                else {
                    for (var i = 0, l = this._ffdVertices.length; i < l; ++i) {
                        this._slotFFDVertices[i] += this._ffdVertices[i] * weight;
                    }
                }
                this.slot._blendIndex++;
                var fadeProgress = this._animationState._fadeProgress;
                if (fadeProgress < 1) {
                    this.slot._ffdDirty = true;
                }
            }
        };
        return FFDTimelineState;
    }(dragonBones.TweenTimelineState));
    dragonBones.FFDTimelineState = FFDTimelineState;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * WorldClock 提供时钟的支持，为每个加入到时钟的 IAnimatable 对象更新时间。
     * @see dragonBones.IAnimatable
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     */
    var WorldClock = (function () {
        /**
         * @language zh_CN
         * 创建一个新的 WorldClock 实例。
         * 通常并不需要单独创建 WorldClock 的实例，可以直接使用 WorldClock.clock 静态实例。
         * (创建更多独立的 WorldClock 可以更灵活的为需要更新的 IAnimateble 实例分组，实现不同组不同速度的动画播放)
         * @version DragonBones 3.0
         */
        function WorldClock() {
            /**
             * @language zh_CN
             * 当前的时间。 (以秒为单位)
             * @version DragonBones 3.0
             */
            this.time = new Date().getTime() / dragonBones.DragonBones.SECOND_TO_MILLISECOND;
            /**
             * @language zh_CN
             * 时间流逝的速度，用于实现动画的变速播放。 [0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
             * @default 1
             * @version DragonBones 3.0
             */
            this.timeScale = 1;
            this._animatebles = [];
        }
        Object.defineProperty(WorldClock, "clock", {
            /**
             * @language zh_CN
             * 一个可以直接使用的全局静态 WorldClock 实例.
             * @version DragonBones 3.0
             */
            get: function () {
                if (!WorldClock._clock) {
                    WorldClock._clock = new WorldClock();
                }
                return WorldClock._clock;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @language zh_CN
         * 为所有的 IAnimatable 实例向前播放一个指定的时间。 (通常这个方法需要在 ENTER_FRAME 事件的响应函数中被调用)
         * @param passedTime 前进的时间。 (以秒为单位，当设置为 -1 时将自动计算当前帧与上一帧的时间差)
         * @version DragonBones 3.0
         */
        WorldClock.prototype.advanceTime = function (passedTime) {
            if (passedTime != passedTime) {
                passedTime = 0;
            }
            if (passedTime < 0) {
                passedTime = new Date().getTime() / dragonBones.DragonBones.SECOND_TO_MILLISECOND - this.time;
            }
            passedTime *= this.timeScale;
            if (passedTime < 0) {
                this.time -= passedTime;
            }
            else {
                this.time += passedTime;
            }
            if (passedTime) {
                var i = 0, r = 0, l = this._animatebles.length;
                for (; i < l; ++i) {
                    var animateble = this._animatebles[i];
                    if (animateble) {
                        animateble.advanceTime(passedTime);
                    }
                    else {
                        r++;
                    }
                }
                if (r > 0) {
                    r = 0;
                    l = this._animatebles.length;
                    for (; i < l; ++i) {
                        var animateble = this._animatebles[i];
                        if (animateble) {
                            this._animatebles[i - r] = animateble;
                        }
                        else {
                            r++;
                        }
                    }
                    this._animatebles.length -= r;
                }
            }
        };
        /**
         * 是否包含指定的 IAnimatable 实例
         * @param value 指定的 IAnimatable 实例。
         * @returns  [true: 包含，false: 不包含]。
         * @version DragonBones 3.0
         */
        WorldClock.prototype.contains = function (value) {
            return this._animatebles.indexOf(value) >= 0;
        };
        /**
         * @language zh_CN
         * 添加指定的 IAnimatable 实例。
         * @param value IAnimatable 实例。
         * @version DragonBones 3.0
         */
        WorldClock.prototype.add = function (value) {
            if (value && this._animatebles.indexOf(value) < 0) {
                this._animatebles.push(value);
                if (dragonBones.DragonBones.DEBUG && value instanceof dragonBones.Armature) {
                    dragonBones.DragonBones.addArmature(value);
                }
            }
        };
        /**
         * @language zh_CN
         * 移除指定的 IAnimatable 实例。
         * @param value IAnimatable 实例。
         * @version DragonBones 3.0
         */
        WorldClock.prototype.remove = function (value) {
            var index = this._animatebles.indexOf(value);
            if (index >= 0) {
                this._animatebles[index] = null;
                if (dragonBones.DragonBones.DEBUG && value instanceof dragonBones.Armature) {
                    dragonBones.DragonBones.removeArmature(value);
                }
            }
        };
        /**
         * @language zh_CN
         * 清除所有的 IAnimatable 实例。
         * @version DragonBones 3.0
         */
        WorldClock.prototype.clear = function () {
            for (var i = 0, l = this._animatebles.length; i < l; ++i) {
                this._animatebles[i] = null;
            }
        };
        WorldClock._clock = null;
        return WorldClock;
    }());
    dragonBones.WorldClock = WorldClock;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 骨架，是骨骼动画系统的核心，由显示容器、骨骼、插槽、动画、事件系统构成。
     * @see dragonBones.ArmatureData
     * @see dragonBones.Bone
     * @see dragonBones.Slot
     * @see dragonBones.Animation
     * @see dragonBones.IArmatureDisplayContainer
     * @version DragonBones 3.0
     */
    var Armature = (function (_super) {
        __extends(Armature, _super);
        /**
         * @private
         */
        function Armature() {
            _super.call(this);
            /**
             * @private Store bones based on bones' hierarchy (From root to leaf)
             */
            this._bones = [];
            /**
             * @private Store slots based on slots' zOrder (From low to high)
             */
            this._slots = [];
            /**
             * @private
             */
            this._events = [];
            /**
             * @deprecated
             * @see #cacheFrameRate
             */
            this.enableCache = false;
        }
        /**
         * @private
         */
        Armature.toString = function () {
            return "[Class dragonBones.Armature]";
        };
        /**
         * @inheritDoc
         */
        Armature.prototype._onClear = function () {
            this.userData = null;
            this._bonesDirty = false;
            this._cacheFrameIndex = -1;
            this._armatureData = null;
            this._skinData = null;
            if (this._animation) {
                this._animation.returnToPool();
                this._animation = null;
            }
            if (this._display) {
                this._display._onClear();
                this._display = null;
            }
            this._parent = null;
            this._action = null;
            this._replacedTexture = null;
            this._delayDispose = false;
            this._lockDispose = false;
            this._slotsDirty = false;
            if (this._bones.length) {
                for (var i = 0, l = this._bones.length; i < l; ++i) {
                    this._bones[i].returnToPool();
                }
                this._bones.length = 0;
            }
            if (this._slots.length) {
                for (var i = 0, l = this._slots.length; i < l; ++i) {
                    this._slots[i].returnToPool();
                }
                this._slots.length = 0;
            }
            if (this._events.length) {
                for (var i = 0, l = this._events.length; i < l; ++i) {
                    this._events[i].returnToPool();
                }
                this._events.length = 0;
            }
        };
        /**
         * @private
         */
        Armature.prototype._sortBones = function () {
            var total = this._bones.length;
            if (!total) {
                return;
            }
            var sortHelper = this._bones.concat();
            var index = 0;
            var count = 0;
            this._bones.length = 0;
            while (count < total) {
                var bone = sortHelper[index++];
                if (index >= total) {
                    index = 0;
                }
                if (this._bones.indexOf(bone) >= 0) {
                    continue;
                }
                if (bone.parent && this._bones.indexOf(bone.parent) < 0) {
                    continue;
                }
                if (bone.ik && this._bones.indexOf(bone.ik) < 0) {
                    continue;
                }
                if (bone.ik && bone.ikChain > 0 && bone.ikChainIndex == bone.ikChain) {
                    this._bones.splice(this._bones.indexOf(bone.parent) + 1, 0, bone); // ik, parent, bone, children
                }
                else {
                    this._bones.push(bone);
                }
                count++;
            }
        };
        /**
         * @private
         */
        Armature.prototype._sortSlots = function () {
        };
        /**
         * @private
         */
        Armature.prototype._addBoneToBoneList = function (value) {
            if (this._bones.indexOf(value) < 0) {
                this._bonesDirty = true;
                this._bones[this._bones.length] = value;
                this._animation._timelineStateDirty = true;
            }
        };
        /**
         * @private
         */
        Armature.prototype._removeBoneFromBoneList = function (value) {
            var index = this._bones.indexOf(value);
            if (index >= 0) {
                this._bones.splice(index, 1);
                this._animation._timelineStateDirty = true;
            }
        };
        /**
         * @private
         */
        Armature.prototype._addSlotToSlotList = function (value) {
            if (this._slots.indexOf(value) < 0) {
                this._slotsDirty = true;
                this._slots[this._slots.length] = value;
                this._animation._timelineStateDirty = true;
            }
        };
        /**
         * @private
         */
        Armature.prototype._removeSlotFromSlotList = function (value) {
            var index = this._slots.indexOf(value);
            if (index >= 0) {
                this._slots.splice(index, 1);
                this._animation._timelineStateDirty = true;
            }
        };
        /**
         * @private
         */
        Armature.prototype._bufferEvent = function (value, type) {
            value.type = type;
            value.armature = this;
            this._events.push(value);
        };
        /**
         * @language zh_CN
         * 释放骨架。 (会回收到内存池)
         * @version DragonBones 3.0
         */
        Armature.prototype.dispose = function () {
            this._delayDispose = true;
            if (!this._lockDispose) {
                this.returnToPool();
            }
        };
        /**
         * @language zh_CN
         * 更新骨架和动画。 (可以使用时钟实例或显示容器来更新)
         * @param passedTime 两帧之前的时间间隔。 (以秒为单位)
         * @see dragonBones.IAnimateble
         * @see dragonBones.WorldClock
         * @see dragonBones.IArmatureDisplay
         * @version DragonBones 3.0
         */
        Armature.prototype.advanceTime = function (passedTime) {
            if (!this._lockDispose) {
                this._lockDispose = true;
                var scaledPassedTime = passedTime * this._animation.timeScale;
                // Animations.
                this._animation._advanceTime(scaledPassedTime);
                // Bones and slots.
                if (this._bonesDirty) {
                    this._bonesDirty = false;
                    this._sortBones();
                }
                if (this._slotsDirty) {
                    this._slotsDirty = false;
                    this._sortSlots();
                }
                for (var i = 0, l = this._bones.length; i < l; ++i) {
                    this._bones[i]._update(this._cacheFrameIndex);
                }
                for (var i = 0, l = this._slots.length; i < l; ++i) {
                    var slot = this._slots[i];
                    slot._update(this._cacheFrameIndex);
                    var childArmature = slot.childArmature;
                    if (childArmature) {
                        if (slot.inheritAnimation) {
                            childArmature.advanceTime(scaledPassedTime);
                        }
                        else {
                            childArmature.advanceTime(passedTime);
                        }
                    }
                }
                // Actions and events.
                if (this._action) {
                    switch (this._action.type) {
                        case 0 /* Play */:
                            this._animation.play(this._action.data[0], this._action.data[1]);
                            break;
                        case 1 /* Stop */:
                            this._animation.stop(this._action.data[0]);
                            break;
                        case 2 /* GotoAndPlay */:
                            this._animation.gotoAndPlayByTime(this._action.data[0], this._action.data[1], this._action.data[2]);
                            break;
                        case 3 /* GotoAndStop */:
                            this._animation.gotoAndStopByTime(this._action.data[0], this._action.data[1]);
                            break;
                        case 4 /* FadeIn */:
                            this._animation.fadeIn(this._action.data[0], this._action.data[1], this._action.data[2]);
                            break;
                        case 5 /* FadeOut */:
                            // TODO fade out
                            break;
                    }
                    this._action = null;
                }
                if (this._events.length > 0) {
                    for (var i = 0, l = this._events.length; i < l; ++i) {
                        var event_5 = this._events[i];
                        if (Armature._soundEventManager && event_5.type == dragonBones.EventObject.SOUND_EVENT) {
                            Armature._soundEventManager._dispatchEvent(event_5);
                        }
                        else {
                            this._display._dispatchEvent(event_5);
                        }
                        event_5.returnToPool();
                    }
                    this._events.length = 0;
                }
                this._lockDispose = false;
            }
            if (this._delayDispose) {
                this.returnToPool();
            }
        };
        /**
         * @language zh_CN
         * 更新骨骼和插槽的变换。 (当骨骼没有动画状态或动画状态播放完成时，骨骼将不在更新)
         * @param boneName 指定的骨骼名称，如果未设置，将更新所有骨骼。
         * @param updateSlotDisplay 是否更新插槽的显示对象。
         * @see dragonBones.Bone
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        Armature.prototype.invalidUpdate = function (boneName, updateSlotDisplay) {
            if (boneName === void 0) { boneName = null; }
            if (updateSlotDisplay === void 0) { updateSlotDisplay = false; }
            if (boneName) {
                var bone = this.getBone(boneName);
                if (bone) {
                    bone.invalidUpdate();
                    if (updateSlotDisplay) {
                        for (var i = 0, l = this._slots.length; i < l; ++i) {
                            var slot = this._slots[i];
                            if (slot.parent == bone) {
                                slot.invalidUpdate();
                            }
                        }
                    }
                }
            }
            else {
                for (var i = 0, l = this._bones.length; i < l; ++i) {
                    this._bones[i].invalidUpdate();
                }
                if (updateSlotDisplay) {
                    for (var i = 0, l = this._slots.length; i < l; ++i) {
                        this._slots[i].invalidUpdate();
                    }
                }
            }
        };
        /**
         * @language zh_CN
         * 获取指定名称的插槽。
         * @param name 插槽的名称。
         * @returns 插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        Armature.prototype.getSlot = function (name) {
            for (var i = 0, l = this._slots.length; i < l; ++i) {
                var slot = this._slots[i];
                if (slot.name == name) {
                    return slot;
                }
            }
            return null;
        };
        /**
         * @language zh_CN
         * 通过显示对象获取插槽。
         * @param display 显示对象。
         * @returns 包含这个显示对象的插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        Armature.prototype.getSlotByDisplay = function (display) {
            if (display) {
                for (var i = 0, l = this._slots.length; i < l; ++i) {
                    var slot = this._slots[i];
                    if (slot.display == display) {
                        return slot;
                    }
                }
            }
            return null;
        };
        /**
         * @language zh_CN
         * 将一个指定的插槽添加到骨架中。
         * @param value 需要添加的插槽。
         * @param parentName 需要添加到的父骨骼名称。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        Armature.prototype.addSlot = function (value, parentName) {
            var bone = this.getBone(parentName);
            if (bone) {
                value._setArmature(this);
                value._setParent(bone);
            }
            else {
                throw new Error();
            }
        };
        /**
         * @language zh_CN
         * 将一个指定的插槽从骨架中移除。
         * @param value 需要移除的插槽
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        Armature.prototype.removeSlot = function (value) {
            if (value && value.armature == this) {
                value._setParent(null);
                value._setArmature(null);
            }
            else {
                throw new Error();
            }
        };
        /**
         * @language zh_CN
         * 获取指定名称的骨骼。
         * @param name 骨骼的名称。
         * @returns 骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         */
        Armature.prototype.getBone = function (name) {
            for (var i = 0, l = this._bones.length; i < l; ++i) {
                var bone = this._bones[i];
                if (bone.name == name) {
                    return bone;
                }
            }
            return null;
        };
        /**
         * @language zh_CN
         * 通过显示对象获取骨骼。
         * @param display 显示对象。
         * @returns 包含这个显示对象的骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         */
        Armature.prototype.getBoneByDisplay = function (display) {
            var slot = this.getSlotByDisplay(display);
            return slot ? slot.parent : null;
        };
        /**
         * @language zh_CN
         * 将一个指定的骨骼添加到骨架中。
         * @param value 需要添加的骨骼。
         * @param parentName 需要添加到父骨骼的名称，如果未设置，则添加到骨架根部。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         */
        Armature.prototype.addBone = function (value, parentName) {
            if (parentName === void 0) { parentName = null; }
            if (value) {
                value._setArmature(this);
                value._setParent(parentName ? this.getBone(parentName) : null);
            }
            else {
                throw new Error();
            }
        };
        /**
         * @language zh_CN
         * 将一个指定的骨骼从骨架中移除。
         * @param value 需要移除的骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         */
        Armature.prototype.removeBone = function (value) {
            if (value && value.armature == this) {
                value._setParent(null);
                value._setArmature(null);
            }
            else {
                throw new Error();
            }
        };
        /**
         * @language zh_CN
         * 替换骨架的主贴图，根据渲染引擎的不同，提供不同的贴图数据。
         * @param texture 用来替换的贴图，根据渲染平台的不同，类型会有所不同，一般是 Texture 类型。
         * @version DragonBones 4.5
         */
        Armature.prototype.replaceTexture = function (texture) {
            this._replacedTexture = texture;
            for (var i = 0, l = this._slots.length; i < l; ++i) {
                this._slots[i].invalidUpdate();
            }
        };
        /**
         * @language zh_CN
         * 获取所有骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         */
        Armature.prototype.getBones = function () {
            return this._bones;
        };
        /**
         * @language zh_CN
         * 获取所有插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        Armature.prototype.getSlots = function () {
            return this._slots;
        };
        Object.defineProperty(Armature.prototype, "name", {
            /**
             * @language zh_CN
             * 骨架名称。
             * @see dragonBones.ArmatureData#name
             * @version DragonBones 3.0
             */
            get: function () {
                return this._armatureData ? this._armatureData.name : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Armature.prototype, "armatureData", {
            /**
             * @language zh_CN
             * 获取骨架数据。
             * @see dragonBones.ArmatureData
             * @version DragonBones 4.5
             */
            get: function () {
                return this._armatureData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Armature.prototype, "animation", {
            /**
             * @language zh_CN
             * 获得动画控制器。
             * @see dragonBones.Animation
             * @version DragonBones 3.0
             */
            get: function () {
                return this._animation;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Armature.prototype, "display", {
            /**
             * @language zh_CN
             * 获取显示容器，插槽的显示对象都会以此显示容器为父级，根据渲染平台的不同，类型会不同，通常是 DisplayObjectContainer 类型。
             * @version DragonBones 3.0
             */
            get: function () {
                return this._display;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Armature.prototype, "parent", {
            /**
             * @language zh_CN
             * 获取父插槽。 (当此骨架是某个骨架的子骨架时，可以通过此属性向上查找从属关系)
             * @see dragonBones.Slot
             * @version DragonBones 4.5
             */
            get: function () {
                return this._parent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Armature.prototype, "cacheFrameRate", {
            /**
             * @language zh_CN
             * 动画缓存的帧率，当设置一个大于 0 的帧率时，将会开启动画缓存。
             * 通过将动画数据缓存在内存中来提高运行性能，会有一定的内存开销。
             * 帧率不宜设置的过高，通常跟动画的帧率相当且低于程序运行的帧率。
             * 开启动画缓存后，某些功能将会失效，比如 Bone 和 Slot 的 offset 属性等。
             * @see dragonBones.DragonBonesData#frameRate
             * @see dragonBones.ArmatureData#frameRate
             * @version DragonBones 4.5
             */
            get: function () {
                return this._armatureData.cacheFrameRate;
            },
            set: function (value) {
                if (this._armatureData.cacheFrameRate != value) {
                    this._armatureData.cacheFrames(value);
                    // Set child armature frameRate.
                    for (var i = 0, l = this._slots.length; i < l; ++i) {
                        var slot = this._slots[i];
                        var childArmature = slot.childArmature;
                        if (childArmature) {
                            childArmature.cacheFrameRate = value;
                        }
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @language zh_CN
         * 开启动画缓存。
         * @param frameRate 动画缓存的帧率
         * @see #cacheFrameRate
         * @version DragonBones 4.5
         */
        Armature.prototype.enableAnimationCache = function (frameRate) {
            this.cacheFrameRate = frameRate;
        };
        /**
         * @language zh_CN
         * 是否包含指定类型的事件。
         * @param type 事件类型。
         * @returns  [true: 包含, false: 不包含]
         * @version DragonBones 3.0
         */
        Armature.prototype.hasEventListener = function (type) {
            this._display.hasEvent(type);
        };
        /**
         * @language zh_CN
         * 添加事件。
         * @param type 事件类型。
         * @param listener 事件回调。
         * @version DragonBones 3.0
         */
        Armature.prototype.addEventListener = function (type, listener, target) {
            this._display.addEvent(type, listener, target);
        };
        /**
         * @language zh_CN
         * 移除事件。
         * @param type 事件类型。
         * @param listener 事件回调。
         * @version DragonBones 3.0
         */
        Armature.prototype.removeEventListener = function (type, listener, target) {
            this._display.removeEvent(type, listener, target);
        };
        /**
         * @deprecated
         * @see #display
         */
        Armature.prototype.getDisplay = function () {
            return this._display;
        };
        /**
         * @private
         */
        Armature._soundEventManager = null;
        return Armature;
    }(dragonBones.BaseObject));
    dragonBones.Armature = Armature;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 骨骼，一个骨架中可以包含多个骨骼，骨骼以树状结构组成骨架。
     * 骨骼在骨骼动画体系中是最重要的逻辑单元之一，负责动画中的平移旋转缩放的实现。
     * @see dragonBones.BoneData
     * @see dragonBones.Armature
     * @see dragonBones.Slot
     * @version DragonBones 3.0
     */
    var Bone = (function (_super) {
        __extends(Bone, _super);
        /**
         * @private
         */
        function Bone() {
            _super.call(this);
            /**
             * @private
             */
            this._animationPose = new dragonBones.Transform();
            /**
             * @private
             */
            this._bones = [];
            /**
             * @private
             */
            this._slots = [];
        }
        /**
         * @private
         */
        Bone.toString = function () {
            return "[Class dragonBones.Bone]";
        };
        /**
         * @inheritDoc
         */
        Bone.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.inheritTranslation = false;
            this.inheritRotation = false;
            this.inheritScale = false;
            this.ikBendPositive = false;
            this.ikWeight = 0;
            this.length = 0;
            this._transformDirty = 2 /* All */; // Update
            this._blendIndex = 0;
            this._cacheFrames = null;
            this._animationPose.identity();
            this._visible = true;
            this._ikChain = 0;
            this._ikChainIndex = 0;
            this._ik = null;
            if (this._bones.length) {
                this._bones.length = 0;
            }
            if (this._slots.length) {
                this._slots.length = 0;
            }
        };
        /**
         * @private
         */
        Bone.prototype._updateGlobalTransformMatrix = function () {
            if (this._parent) {
                var parentRotation = this._parent.global.skewY; // Only inherit skew y.
                var parentMatrix = this._parent.globalTransformMatrix;
                if (this.inheritScale) {
                    if (!this.inheritRotation) {
                        this.global.skewX -= parentRotation;
                        this.global.skewY -= parentRotation;
                    }
                    this.global.toMatrix(this.globalTransformMatrix);
                    this.globalTransformMatrix.concat(parentMatrix);
                    if (!this.inheritTranslation) {
                        this.globalTransformMatrix.tx = this.global.x;
                        this.globalTransformMatrix.ty = this.global.y;
                    }
                    this.global.fromMatrix(this.globalTransformMatrix);
                }
                else {
                    if (this.inheritTranslation) {
                        var x = this.global.x;
                        var y = this.global.y;
                        this.global.x = parentMatrix.a * x + parentMatrix.c * y + parentMatrix.tx;
                        this.global.y = parentMatrix.d * y + parentMatrix.b * x + parentMatrix.ty;
                    }
                    if (this.inheritRotation) {
                        this.global.skewX += parentRotation;
                        this.global.skewY += parentRotation;
                    }
                    this.global.toMatrix(this.globalTransformMatrix);
                }
            }
            else {
                this.global.toMatrix(this.globalTransformMatrix);
            }
        };
        /**
         * @private
         */
        Bone.prototype._computeIKA = function () {
            var ikGlobal = this._ik.global;
            var x = this.globalTransformMatrix.a * this.length;
            var y = this.globalTransformMatrix.b * this.length;
            var ikRadian = (Math.atan2(ikGlobal.y - this.global.y, ikGlobal.x - this.global.x) +
                this.offset.skewY -
                this.global.skewY * 2 +
                Math.atan2(y, x)) * this.ikWeight; // Support offset.
            this.global.skewX += ikRadian;
            this.global.skewY += ikRadian;
            this.global.toMatrix(this.globalTransformMatrix);
        };
        /**
         * @private
         */
        Bone.prototype._computeIKB = function () {
            var parentGlobal = this._parent.global;
            var ikGlobal = this._ik.global;
            var x = this.globalTransformMatrix.a * this.length;
            var y = this.globalTransformMatrix.b * this.length;
            var lLL = x * x + y * y;
            var lL = Math.sqrt(lLL);
            var dX = this.global.x - parentGlobal.x;
            var dY = this.global.y - parentGlobal.y;
            var lPP = dX * dX + dY * dY;
            var lP = Math.sqrt(lPP);
            dX = ikGlobal.x - parentGlobal.x;
            dY = ikGlobal.y - parentGlobal.y;
            var lTT = dX * dX + dY * dY;
            var lT = Math.sqrt(lTT);
            var ikRadianA = 0;
            if (lL + lP <= lT || lT + lL <= lP || lT + lP <= lL) {
                ikRadianA = Math.atan2(ikGlobal.y - parentGlobal.y, ikGlobal.x - parentGlobal.x) + this._parent.offset.skewY; // Support offset.
                if (lL + lP <= lT) {
                }
                else if (lP < lL) {
                    ikRadianA += Math.PI;
                }
            }
            else {
                var h = (lPP - lLL + lTT) / (2 * lTT);
                var r = Math.sqrt(lPP - h * h * lTT) / lT;
                var hX = parentGlobal.x + (dX * h);
                var hY = parentGlobal.y + (dY * h);
                var rX = -dY * r;
                var rY = dX * r;
                if (this.ikBendPositive) {
                    this.global.x = hX - rX;
                    this.global.y = hY - rY;
                }
                else {
                    this.global.x = hX + rX;
                    this.global.y = hY + rY;
                }
                ikRadianA = Math.atan2(this.global.y - parentGlobal.y, this.global.x - parentGlobal.x) + this._parent.offset.skewY; // Support offset.
            }
            ikRadianA = (ikRadianA - parentGlobal.skewY) * this.ikWeight;
            parentGlobal.skewX += ikRadianA;
            parentGlobal.skewY += ikRadianA;
            parentGlobal.toMatrix(this._parent.globalTransformMatrix);
            this._parent._transformDirty = 1 /* Self */;
            this.global.x = parentGlobal.x + Math.cos(parentGlobal.skewY) * lP;
            this.global.y = parentGlobal.y + Math.sin(parentGlobal.skewY) * lP;
            var ikRadianB = (Math.atan2(ikGlobal.y - this.global.y, ikGlobal.x - this.global.x) + this.offset.skewY -
                this.global.skewY * 2 + Math.atan2(y, x)) * this.ikWeight; // Support offset.
            this.global.skewX += ikRadianB;
            this.global.skewY += ikRadianB;
            this.global.toMatrix(this.globalTransformMatrix);
        };
        /**
         * @inheritDoc
         */
        Bone.prototype._setArmature = function (value) {
            if (this._armature == value) {
                return;
            }
            this._ik = null;
            var oldSlots = null;
            var oldBones = null;
            if (this._armature) {
                oldSlots = this.getSlots();
                oldBones = this.getBones();
                this._armature._removeBoneFromBoneList(this);
            }
            this._armature = value;
            if (this._armature) {
                this._armature._addBoneToBoneList(this);
            }
            if (oldSlots) {
                for (var i = 0, l = oldSlots.length; i < l; ++i) {
                    var slot = oldSlots[i];
                    if (slot.parent == this) {
                        slot._setArmature(this._armature);
                    }
                }
            }
            if (oldBones) {
                for (var i = 0, l = oldBones.length; i < l; ++i) {
                    var bone = oldBones[i];
                    if (bone.parent == this) {
                        bone._setArmature(this._armature);
                    }
                }
            }
        };
        /**
         * @private
         */
        Bone.prototype._setIK = function (value, chain, chainIndex) {
            if (value) {
                if (chain == chainIndex) {
                    var chainEnd = this._parent;
                    if (chain && chainEnd) {
                        chain = 1;
                    }
                    else {
                        chain = 0;
                        chainIndex = 0;
                        chainEnd = this;
                    }
                    if (chainEnd == value || chainEnd.contains(value)) {
                        value = null;
                        chain = 0;
                        chainIndex = 0;
                    }
                    else {
                        var ancestor = value;
                        while (ancestor.ik && ancestor.ikChain) {
                            if (chainEnd.contains(ancestor.ik)) {
                                value = null;
                                chain = 0;
                                chainIndex = 0;
                                break;
                            }
                            ancestor = ancestor.parent;
                        }
                    }
                }
            }
            else {
                chain = 0;
                chainIndex = 0;
            }
            this._ik = value;
            this._ikChain = chain;
            this._ikChainIndex = chainIndex;
            if (this._armature) {
                this._armature._bonesDirty = true;
            }
        };
        /**
         * @private
         */
        Bone.prototype._update = function (cacheFrameIndex) {
            this._blendIndex = 0;
            if (cacheFrameIndex >= 0) {
                var cacheFrame = this._cacheFrames[cacheFrameIndex];
                if (this.globalTransformMatrix == cacheFrame) {
                    this._transformDirty = 0 /* None */;
                }
                else if (cacheFrame) {
                    this._transformDirty = 2 /* All */; // For update children and ik children.
                    this.globalTransformMatrix = cacheFrame;
                }
                else if (this._transformDirty == 2 /* All */ ||
                    (this._parent && this._parent._transformDirty != 0 /* None */) ||
                    (this._ik && this.ikWeight > 0 && this._ik._transformDirty != 0 /* None */)) {
                    this._transformDirty = 2 /* All */; // For update children and ik children.
                    this.globalTransformMatrix = this._globalTransformMatrix;
                }
                else if (this.globalTransformMatrix != this._globalTransformMatrix) {
                    this._transformDirty = 0 /* None */;
                    this._cacheFrames[cacheFrameIndex] = this.globalTransformMatrix;
                }
                else {
                    this._transformDirty = 1 /* Self */;
                    this.globalTransformMatrix = this._globalTransformMatrix;
                }
            }
            else if (this._transformDirty == 2 /* All */ ||
                (this._parent && this._parent._transformDirty != 0 /* None */) ||
                (this._ik && this.ikWeight > 0 && this._ik._transformDirty != 0 /* None */)) {
                this._transformDirty = 2 /* All */; // For update children and ik children.
                this.globalTransformMatrix = this._globalTransformMatrix;
            }
            if (this._transformDirty != 0 /* None */) {
                if (this._transformDirty == 2 /* All */) {
                    this._transformDirty = 1 /* Self */;
                }
                else {
                    this._transformDirty = 0 /* None */;
                }
                if (this.globalTransformMatrix == this._globalTransformMatrix) {
                    /*this.global.copyFrom(this.origin).add(this.offset).add(this._animationPose);*/
                    this.global.x = this.origin.x + this.offset.x + this._animationPose.x;
                    this.global.y = this.origin.y + this.offset.y + this._animationPose.y;
                    this.global.skewX = this.origin.skewX + this.offset.skewX + this._animationPose.skewX;
                    this.global.skewY = this.origin.skewY + this.offset.skewY + this._animationPose.skewY;
                    this.global.scaleX = this.origin.scaleX * this.offset.scaleX * this._animationPose.scaleX;
                    this.global.scaleY = this.origin.scaleY * this.offset.scaleY * this._animationPose.scaleY;
                    this._updateGlobalTransformMatrix();
                    if (this._ik && this._ikChainIndex == this._ikChain && this.ikWeight > 0) {
                        if (this.inheritTranslation && this._ikChain > 0 && this._parent) {
                            this._computeIKB();
                        }
                        else {
                            this._computeIKA();
                        }
                    }
                    if (cacheFrameIndex >= 0) {
                        this.globalTransformMatrix = dragonBones.BoneTimelineData.cacheFrame(this._cacheFrames, cacheFrameIndex, this._globalTransformMatrix);
                    }
                }
            }
        };
        /**
         * @language zh_CN
         * 下一帧更新变换。 (当骨骼没有动画状态或动画状态播放完成时，骨骼将不在更新)
         * @version DragonBones 3.0
         */
        Bone.prototype.invalidUpdate = function () {
            this._transformDirty = 2 /* All */;
        };
        /**
         * @language zh_CN
         * 是否包含某个指定的骨骼或插槽。
         * @returns [true: 包含，false: 不包含]
         * @see dragonBones.TransformObject
         * @version DragonBones 3.0
         */
        Bone.prototype.contains = function (child) {
            if (child) {
                if (child == this) {
                    return false;
                }
                var ancestor = child;
                while (ancestor != this && ancestor) {
                    ancestor = ancestor.parent;
                }
                return ancestor == this;
            }
            return false;
        };
        /**
         * @language zh_CN
         * 所有的子骨骼。
         * @version DragonBones 3.0
         */
        Bone.prototype.getBones = function () {
            this._bones.length = 0;
            var bones = this._armature.getBones();
            for (var i = 0, l = bones.length; i < l; ++i) {
                var bone = bones[i];
                if (bone.parent == this) {
                    this._bones.push(bone);
                }
            }
            return this._bones;
        };
        /**
         * @language zh_CN
         * 所有的插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        Bone.prototype.getSlots = function () {
            this._slots.length = 0;
            var slots = this._armature.getSlots();
            for (var i = 0, l = slots.length; i < l; ++i) {
                var slot = slots[i];
                if (slot.parent == this) {
                    this._slots.push(slot);
                }
            }
            return this._slots;
        };
        Object.defineProperty(Bone.prototype, "ikChain", {
            /**
             * @private
             */
            get: function () {
                return this._ikChain;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bone.prototype, "ikChainIndex", {
            /**
             * @private
             */
            get: function () {
                return this._ikChainIndex;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bone.prototype, "ik", {
            /**
             * @language zh_CN
             * 当前的 IK 约束目标。
             * @version DragonBones 4.5
             */
            get: function () {
                return this._ik;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bone.prototype, "visible", {
            /**
             * @language zh_CN
             * 控制此骨骼所有插槽的显示。
             * @default true
             * @see dragonBones.Slot
             * @version DragonBones 3.0
             */
            get: function () {
                return this._visible;
            },
            set: function (value) {
                if (this._visible == value) {
                    return;
                }
                this._visible = value;
                var slots = this._armature.getSlots();
                for (var i = 0, l = slots.length; i < l; ++i) {
                    var slot = slots[i];
                    if (slot._parent == this) {
                        slot._updateVisible();
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bone.prototype, "slot", {
            /**
             * @deprecated
             * @see dragonBones.Armature#getSlot()
             */
            get: function () {
                var slots = this._armature.getSlots();
                for (var i = 0, l = slots.length; i < l; ++i) {
                    var slot = slots[i];
                    if (slot.parent == this) {
                        return slot;
                    }
                }
                return null;
            },
            enumerable: true,
            configurable: true
        });
        return Bone;
    }(dragonBones.TransformObject));
    dragonBones.Bone = Bone;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 插槽，附着在骨骼上，控制显示对象的显示状态和属性。
     * 一个骨骼上可以包含多个插槽。
     * 一个插槽中可以包含多个显示对象，同一时间只能显示其中的一个显示对象，但可以在动画播放的过程中切换显示对象实现帧动画。
     * 显示对象可以是普通的图片纹理，也可以是子骨架的显示容器，网格显示对象，还可以是自定义的其他显示对象。
     * @see dragonBones.Armature
     * @see dragonBones.Bone
     * @see dragonBones.SlotData
     * @version DragonBones 3.0
     */
    var Slot = (function (_super) {
        __extends(Slot, _super);
        /**
         * @private
         */
        function Slot() {
            _super.call(this);
            /**
             * @private
             */
            this._colorTransform = new dragonBones.ColorTransform();
            /**
             * @private
             */
            this._ffdVertices = [];
            /**
             * @private
             */
            this._replacedDisplayDataSet = [];
            /**
             * @private
             */
            this._localMatrix = new dragonBones.Matrix();
            /**
             * @private
             */
            this._displayList = [];
            /**
             * @private
             */
            this._meshBones = [];
        }
        /**
         * @inheritDoc
         */
        Slot.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            var disposeDisplayList = [];
            for (var i = 0, l = this._displayList.length; i < l; ++i) {
                var eachDisplay = this._displayList[i];
                if (eachDisplay != this._rawDisplay && eachDisplay != this._meshDisplay &&
                    disposeDisplayList.indexOf(eachDisplay) < 0) {
                    disposeDisplayList.push(eachDisplay);
                }
            }
            for (var i = 0, l = disposeDisplayList.length; i < l; ++i) {
                var eachDisplay = disposeDisplayList[i];
                if (eachDisplay instanceof dragonBones.Armature) {
                    eachDisplay.returnToPool();
                }
                else {
                    this._disposeDisplay(eachDisplay);
                }
            }
            if (this._meshDisplay && this._meshDisplay != this._rawDisplay) {
                this._disposeDisplay(this._meshDisplay);
            }
            if (this._rawDisplay) {
                this._disposeDisplay(this._rawDisplay);
            }
            this.inheritAnimation = true;
            this.displayController = null;
            this._colorDirty = false;
            this._ffdDirty = false;
            this._blendIndex = 0;
            this._zOrder = 0;
            this._displayDataSet = null;
            this._meshData = null;
            this._cacheFrames = null;
            this._rawDisplay = null;
            this._meshDisplay = null;
            this._colorTransform.identity();
            if (this._ffdVertices.length) {
                this._ffdVertices.length = 0;
            }
            if (this._replacedDisplayDataSet.length) {
                this._replacedDisplayDataSet.length = 0;
            }
            this._displayDirty = false;
            this._blendModeDirty = false;
            this._originDirty = false;
            this._transformDirty = false;
            this._displayIndex = 0;
            this._blendMode = 0 /* Normal */;
            this._display = null;
            this._childArmature = null;
            this._localMatrix.identity();
            if (this._displayList.length) {
                this._displayList.length = 0;
            }
            if (this._meshBones.length) {
                this._meshBones.length = 0;
            }
        };
        /**
         * @private
         */
        Slot.prototype._isMeshBonesUpdate = function () {
            for (var i = 0, l = this._meshBones.length; i < l; ++i) {
                if (this._meshBones[i]._transformDirty != 0 /* None */) {
                    return true;
                }
            }
            return false;
        };
        /**
         * @private
         */
        Slot.prototype._updateDisplay = function () {
            var prevDisplay = this._display || this._rawDisplay;
            var prevChildArmature = this._childArmature;
            if (this._displayIndex >= 0 && this._displayIndex < this._displayList.length) {
                this._display = this._displayList[this._displayIndex];
                if (this._display instanceof dragonBones.Armature) {
                    this._childArmature = this._display;
                    this._display = this._childArmature._display;
                }
                else {
                    this._childArmature = null;
                }
            }
            else {
                this._display = null;
                this._childArmature = null;
            }
            var currentDisplay = this._display || this._rawDisplay;
            if (currentDisplay != prevDisplay) {
                this._onUpdateDisplay();
                if (prevDisplay) {
                    this._replaceDisplay(prevDisplay);
                }
                else {
                    this._addDisplay();
                }
                this._blendModeDirty = true;
                this._colorDirty = true;
            }
            // Update origin.
            if (this._displayDataSet && this._displayIndex >= 0 && this._displayIndex < this._displayDataSet.displays.length) {
                this.origin.copyFrom(this._displayDataSet.displays[this._displayIndex].transform);
                this._originDirty = true;
            }
            // Update meshData.
            this._updateMeshData(false);
            // Update frame.
            if (currentDisplay == this._rawDisplay || currentDisplay == this._meshDisplay) {
                this._updateFrame();
            }
            // Update child armature.
            if (this._childArmature != prevChildArmature) {
                if (prevChildArmature) {
                    prevChildArmature._parent = null; // Update child armature parent.
                    if (this.inheritAnimation) {
                        prevChildArmature.animation.reset();
                    }
                }
                if (this._childArmature) {
                    this._childArmature._parent = this; // Update child armature parent.
                    if (this.inheritAnimation) {
                        // Set child armature frameRate.
                        var cacheFrameRate = this._armature.cacheFrameRate;
                        if (cacheFrameRate) {
                            this._childArmature.cacheFrameRate = cacheFrameRate;
                        }
                        var slotData = this._armature.armatureData.getSlot(this.name);
                        if (slotData.actions.length > 0) {
                            this._childArmature._action = slotData.actions[slotData.actions.length - 1];
                        }
                        else {
                            this._childArmature.animation.play();
                        }
                    }
                }
            }
        };
        /**
         * @private
         */
        Slot.prototype._updateLocalTransformMatrix = function () {
            this.global.copyFrom(this.origin).add(this.offset).toMatrix(this._localMatrix);
        };
        /**
         * @private
         */
        Slot.prototype._updateGlobalTransformMatrix = function () {
            this.globalTransformMatrix.copyFrom(this._localMatrix);
            this.globalTransformMatrix.concat(this._parent.globalTransformMatrix);
            this.global.fromMatrix(this.globalTransformMatrix);
        };
        /**
         * @inheritDoc
         */
        Slot.prototype._setArmature = function (value) {
            if (this._armature == value) {
                return;
            }
            if (this._armature) {
                this._armature._removeSlotFromSlotList(this);
            }
            this._armature = value;
            this._onUpdateDisplay();
            if (this._armature) {
                this._armature._addSlotToSlotList(this);
                this._addDisplay();
            }
            else {
                this._removeDisplay();
            }
        };
        /**
         * @private Armature
         */
        Slot.prototype._updateMeshData = function (isTimelineUpdate) {
            var prevMeshData = this._meshData;
            if (this._display == this._meshDisplay && this._displayDataSet && this._displayIndex >= 0 && this._displayIndex < this._displayDataSet.displays.length) {
                this._meshData = this._displayDataSet.displays[this._displayIndex].meshData;
            }
            else {
                this._meshData = null;
            }
            if (this._meshData != prevMeshData) {
                if (this._meshData) {
                    if (this._meshData.skinned) {
                        this._meshBones.length = this._meshData.bones.length;
                        for (var i = 0, l = this._meshBones.length; i < l; ++i) {
                            this._meshBones[i] = this._armature.getBone(this._meshData.bones[i].name);
                        }
                        var ffdVerticesCount = 0;
                        for (var i = 0, l = this._meshData.boneIndices.length; i < l; ++i) {
                            ffdVerticesCount += this._meshData.boneIndices[i].length;
                        }
                        this._ffdVertices.length = ffdVerticesCount * 2;
                    }
                    else {
                        this._meshBones.length = 0;
                        this._ffdVertices.length = this._meshData.vertices.length;
                    }
                    for (var i = 0, l = this._ffdVertices.length; i < l; ++i) {
                        this._ffdVertices[i] = 0;
                    }
                    this._ffdDirty = true;
                }
                else {
                    this._meshBones.length = 0;
                    this._ffdVertices.length = 0;
                }
                if (isTimelineUpdate) {
                    this._armature.animation._updateFFDTimelineStates();
                }
            }
        };
        /**
         * @private Armature
         */
        Slot.prototype._update = function (cacheFrameIndex) {
            this._blendIndex = 0;
            if (this._displayDirty) {
                this._displayDirty = false;
                this._updateDisplay();
            }
            if (!this._display) {
                return;
            }
            if (this._blendModeDirty) {
                this._blendModeDirty = false;
                this._updateBlendMode();
            }
            if (this._colorDirty) {
                this._colorDirty = false;
                this._updateColor();
            }
            if (this._meshData) {
                if (this._ffdDirty || (this._meshData.skinned && this._isMeshBonesUpdate())) {
                    this._ffdDirty = false;
                    this._updateMesh();
                }
                if (this._meshData.skinned) {
                    return;
                }
            }
            if (this._originDirty) {
                this._originDirty = false;
                this._transformDirty = true;
                this._updateLocalTransformMatrix();
            }
            if (cacheFrameIndex >= 0) {
                var cacheFrame = this._cacheFrames[cacheFrameIndex];
                if (this.globalTransformMatrix == cacheFrame) {
                    this._transformDirty = false;
                }
                else if (cacheFrame) {
                    this._transformDirty = true;
                    this.globalTransformMatrix = cacheFrame;
                }
                else if (this._transformDirty || this._parent._transformDirty != 0 /* None */) {
                    this._transformDirty = true;
                    this.globalTransformMatrix = this._globalTransformMatrix;
                }
                else if (this.globalTransformMatrix != this._globalTransformMatrix) {
                    this._transformDirty = false;
                    this._cacheFrames[cacheFrameIndex] = this.globalTransformMatrix;
                }
                else {
                    this._transformDirty = true;
                    this.globalTransformMatrix = this._globalTransformMatrix;
                }
            }
            else if (this._transformDirty || this._parent._transformDirty != 0 /* None */) {
                this._transformDirty = true;
                this.globalTransformMatrix = this._globalTransformMatrix;
            }
            if (this._transformDirty) {
                this._transformDirty = false;
                if (this.globalTransformMatrix == this._globalTransformMatrix) {
                    this._updateGlobalTransformMatrix();
                    if (cacheFrameIndex >= 0) {
                        this.globalTransformMatrix = dragonBones.SlotTimelineData.cacheFrame(this._cacheFrames, cacheFrameIndex, this._globalTransformMatrix);
                    }
                }
                this._updateTransform();
            }
        };
        /**
         * @private Factory
         */
        Slot.prototype._setDisplayList = function (value) {
            if (value && value.length) {
                if (this._displayList.length != value.length) {
                    this._displayList.length = value.length;
                }
                for (var i = 0, l = this._displayList.length; i < l; ++i) {
                    var eachDisplay = value[i];
                    if (eachDisplay && eachDisplay != this._rawDisplay && eachDisplay != this._meshDisplay && !(eachDisplay instanceof dragonBones.Armature) &&
                        this._displayList.indexOf(eachDisplay) < 0) {
                        this._initDisplay(eachDisplay);
                    }
                    this._displayList[i] = eachDisplay;
                }
            }
            else if (this._displayList.length) {
                this._displayList.length = 0;
            }
            if (this._displayIndex >= 0 && this._displayIndex < this._displayList.length) {
                this._displayDirty = this._display != this._displayList[this._displayIndex];
            }
            else {
                this._displayDirty = this._display != null;
            }
            return this._displayDirty;
        };
        /**
         * @private Factory
         */
        Slot.prototype._setDisplayIndex = function (value) {
            if (this._displayIndex == value) {
                return false;
            }
            this._displayIndex = value;
            this._displayDirty = true;
            return this._displayDirty;
        };
        /**
         * @private Factory
         */
        Slot.prototype._setBlendMode = function (value) {
            if (this._blendMode == value) {
                return false;
            }
            this._blendMode = value;
            this._blendModeDirty = true;
            return true;
        };
        /**
         * @private Factory
         */
        Slot.prototype._setColor = function (value) {
            this._colorTransform.copyFrom(value);
            this._colorDirty = true;
            return true;
        };
        /**
         * @language zh_CN
         * 在下一帧更新显示对象的状态。
         * @version DragonBones 4.5
         */
        Slot.prototype.invalidUpdate = function () {
            this._displayDirty = true;
        };
        Object.defineProperty(Slot.prototype, "rawDisplay", {
            /**
             * @private
             */
            get: function () {
                return this._rawDisplay;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slot.prototype, "MeshDisplay", {
            /**
             * @private
             */
            get: function () {
                return this._meshDisplay;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slot.prototype, "displayIndex", {
            /**
             * @language zh_CN
             * 此时显示的显示对象在显示列表中的索引。
             * @version DragonBones 4.5
             */
            get: function () {
                return this._displayIndex;
            },
            set: function (value) {
                if (this._setDisplayIndex(value)) {
                    this._update(-1);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slot.prototype, "displayList", {
            /**
             * @language zh_CN
             * 包含显示对象或子骨架的显示列表。
             * @version DragonBones 3.0
             */
            get: function () {
                return this._displayList.concat();
            },
            set: function (value) {
                var backupDisplayList = this._displayList.concat(); // Copy.
                var disposeDisplayList = [];
                if (this._setDisplayList(value)) {
                    this._update(-1);
                }
                // Release replaced render displays.
                for (var i = 0, l = backupDisplayList.length; i < l; ++i) {
                    var eachDisplay = backupDisplayList[i];
                    if (eachDisplay != this._rawDisplay && eachDisplay != this._meshDisplay &&
                        this._displayList.indexOf(eachDisplay) < 0 &&
                        disposeDisplayList.indexOf(eachDisplay) < 0) {
                        disposeDisplayList.push(eachDisplay);
                    }
                }
                for (var i = 0, l = disposeDisplayList.length; i < l; ++i) {
                    var eachDisplay = disposeDisplayList[i];
                    if (eachDisplay instanceof dragonBones.Armature) {
                        (eachDisplay).returnToPool();
                    }
                    else {
                        this._disposeDisplay(eachDisplay);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slot.prototype, "display", {
            /**
             * @language zh_CN
             * 此时显示的显示对象。
             * @version DragonBones 3.0
             */
            get: function () {
                return this._display;
            },
            set: function (value) {
                if (this._display == value) {
                    return;
                }
                var displayListLength = this._displayList.length;
                if (this._displayIndex < 0 && displayListLength == 0) {
                    this._displayIndex = 0;
                }
                if (this._displayIndex < 0) {
                    return;
                }
                else {
                    var replaceDisplayList = this.displayList; // Copy.
                    if (displayListLength <= this._displayIndex) {
                        replaceDisplayList.length = this._displayIndex + 1;
                    }
                    replaceDisplayList[this._displayIndex] = value;
                    this.displayList = replaceDisplayList;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slot.prototype, "childArmature", {
            /**
             * @language zh_CN
             * 此时显示的子骨架。
             * @see dragonBones.Armature
             * @version DragonBones 3.0
             */
            get: function () {
                return this._childArmature;
            },
            set: function (value) {
                if (this._childArmature == value) {
                    return;
                }
                this.display = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @deprecated
         * @see #display
         */
        Slot.prototype.getDisplay = function () {
            return this._display;
        };
        /**
         * @deprecated
         * @see #display
         */
        Slot.prototype.setDisplay = function (value) {
            this.display = value;
        };
        return Slot;
    }(dragonBones.TransformObject));
    dragonBones.Slot = Slot;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 事件数据。
     * @version DragonBones 4.5
     */
    var EventObject = (function (_super) {
        __extends(EventObject, _super);
        /**
         * @private
         */
        function EventObject() {
            _super.call(this);
        }
        /**
         * @private
         */
        EventObject.toString = function () {
            return "[Class dragonBones.EventObject]";
        };
        /**
         * @inheritDoc
         */
        EventObject.prototype._onClear = function () {
            this.type = null;
            this.name = null;
            this.data = null;
            this.armature = null;
            this.bone = null;
            this.slot = null;
            this.animationState = null;
            this.userData = null;
        };
        Object.defineProperty(EventObject.prototype, "animationName", {
            /**
             * @see #animationState
             */
            get: function () {
                return this.animationState.name;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @language zh_CN
         * 动画开始。
         * @version DragonBones 4.5
         */
        EventObject.START = "start";
        /**
         * @language zh_CN
         * 动画循环播放一次完成。
         * @version DragonBones 4.5
         */
        EventObject.LOOP_COMPLETE = "loopComplete";
        /**
         * @language zh_CN
         * 动画播放完成。
         * @version DragonBones 4.5
         */
        EventObject.COMPLETE = "complete";
        /**
         * @language zh_CN
         * 动画淡入开始。
         * @version DragonBones 4.5
         */
        EventObject.FADE_IN = "fadeIn";
        /**
         * @language zh_CN
         * 动画淡入完成。
         * @version DragonBones 4.5
         */
        EventObject.FADE_IN_COMPLETE = "fadeInComplete";
        /**
         * @language zh_CN
         * 动画淡出开始。
         * @version DragonBones 4.5
         */
        EventObject.FADE_OUT = "fadeOut";
        /**
         * @language zh_CN
         * 动画淡出完成。
         * @version DragonBones 4.5
         */
        EventObject.FADE_OUT_COMPLETE = "fadeOutComplete";
        /**
         * @language zh_CN
         * 动画帧事件。
         * @version DragonBones 4.5
         */
        EventObject.FRAME_EVENT = "frameEvent";
        /**
         * @language zh_CN
         * 动画声音事件。
         * @version DragonBones 4.5
         */
        EventObject.SOUND_EVENT = "soundEvent";
        return EventObject;
    }(dragonBones.BaseObject));
    dragonBones.EventObject = EventObject;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 生成骨架的基础工厂。
     * @see dragonBones.DragonBonesData
     * @see dragonBones.TextureAtlasData
     * @see dragonBones.ArmatureData
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     */
    var BaseFactory = (function () {
        /**
         * @private
         */
        function BaseFactory() {
            /**
             * @language zh_CN
             * 是否开启共享搜索。 [true: 开启, false: 不开启]
             * 如果开启，创建一个骨架时，可以从多个龙骨数据中寻找骨架数据，或贴图集数据中寻找贴图数据。 (通常在有共享导出的数据时开启)
             * @see dragonBones.DragonBonesData#autoSearch
             * @see dragonBones.TextureAtlasData#autoSearch
             * @version DragonBones 4.5
             */
            this.autoSearch = false;
            /**
             * @private
             */
            this._objectDataParser = new dragonBones.ObjectDataParser();
            /**
             * @private
             */
            this._dragonBonesDataMap = {};
            /**
             * @private
             */
            this._textureAtlasDataMap = {};
        }
        /**
         * @private
         */
        BaseFactory.prototype._getTextureData = function (dragonBonesName, textureName) {
            var textureAtlasDataList = this._textureAtlasDataMap[dragonBonesName];
            if (textureAtlasDataList) {
                for (var i = 0, l = textureAtlasDataList.length; i < l; ++i) {
                    var textureData = textureAtlasDataList[i].getTextureData(textureName);
                    if (textureData) {
                        return textureData;
                    }
                }
            }
            if (this.autoSearch) {
                for (var i in this._textureAtlasDataMap) {
                    textureAtlasDataList = this._textureAtlasDataMap[i];
                    for (var j = 0, lJ = textureAtlasDataList.length; j < lJ; ++j) {
                        var textureAtlasData = textureAtlasDataList[j];
                        if (textureAtlasData.autoSearch) {
                            var textureData = textureAtlasData.getTextureData(textureName);
                            if (textureData) {
                                return textureData;
                            }
                        }
                    }
                }
            }
            return null;
        };
        /**
         * @private
         */
        BaseFactory.prototype._fillBuildArmaturePackage = function (dragonBonesName, armatureName, skinName, dataPackage) {
            if (dragonBonesName) {
                var dragonBonesData = this._dragonBonesDataMap[dragonBonesName];
                if (dragonBonesData) {
                    var armatureData = dragonBonesData.getArmature(armatureName);
                    if (armatureData) {
                        dataPackage.dataName = dragonBonesName;
                        dataPackage.data = dragonBonesData;
                        dataPackage.armature = armatureData;
                        dataPackage.skin = armatureData.getSkin(skinName);
                        if (!dataPackage.skin) {
                            dataPackage.skin = armatureData.defaultSkin;
                        }
                        return true;
                    }
                }
            }
            if (!dragonBonesName || this.autoSearch) {
                for (var eachDragonBonesName in this._dragonBonesDataMap) {
                    var dragonBonesData = this._dragonBonesDataMap[eachDragonBonesName];
                    if (!dragonBonesName || dragonBonesData.autoSearch) {
                        var armatureData = dragonBonesData.getArmature(armatureName);
                        if (armatureData) {
                            dataPackage.dataName = eachDragonBonesName;
                            dataPackage.data = dragonBonesData;
                            dataPackage.armature = armatureData;
                            dataPackage.skin = armatureData.getSkin(skinName);
                            if (!dataPackage.skin) {
                                dataPackage.skin = armatureData.defaultSkin;
                            }
                            return true;
                        }
                    }
                }
            }
            return false;
        };
        /**
         * @private
         */
        BaseFactory.prototype._buildBones = function (dataPackage, armature) {
            var bones = dataPackage.armature.sortedBones;
            for (var i = 0, l = bones.length; i < l; ++i) {
                var boneData = bones[i];
                var bone = dragonBones.BaseObject.borrowObject(dragonBones.Bone);
                bone.name = boneData.name;
                bone.inheritTranslation = boneData.inheritTranslation;
                bone.inheritRotation = boneData.inheritRotation;
                bone.inheritScale = boneData.inheritScale;
                bone.length = boneData.length;
                bone.origin.copyFrom(boneData.transform);
                if (boneData.parent) {
                    armature.addBone(bone, boneData.parent.name);
                }
                else {
                    armature.addBone(bone);
                }
                if (boneData.ik) {
                    bone.ikBendPositive = boneData.bendPositive;
                    bone.ikWeight = boneData.weight;
                    bone._setIK(armature.getBone(boneData.ik.name), boneData.chain, boneData.chainIndex);
                }
            }
        };
        /**
         * @private
         */
        BaseFactory.prototype._buildSlots = function (dataPackage, armature) {
            var currentSkin = dataPackage.skin;
            var defaultSkin = dataPackage.armature.defaultSkin;
            var slotDisplayDataSetMap = {};
            for (var i in defaultSkin.slots) {
                var slotDisplayDataSet = defaultSkin.slots[i];
                slotDisplayDataSetMap[slotDisplayDataSet.slot.name] = slotDisplayDataSet;
            }
            if (currentSkin != defaultSkin) {
                for (var i in currentSkin.slots) {
                    var slotDisplayDataSet = currentSkin.slots[i];
                    slotDisplayDataSetMap[slotDisplayDataSet.slot.name] = slotDisplayDataSet;
                }
            }
            var slots = dataPackage.armature.sortedSlots;
            for (var i = 0, l = slots.length; i < l; ++i) {
                var slotData = slots[i];
                var slotDisplayDataSet = slotDisplayDataSetMap[slotData.name];
                if (!slotDisplayDataSet) {
                    continue;
                }
                var slot = this._generateSlot(dataPackage, slotDisplayDataSet);
                slot._displayDataSet = slotDisplayDataSet;
                slot._setDisplayIndex(slotData.displayIndex);
                slot._setBlendMode(slotData.blendMode);
                slot._setColor(slotData.color);
                slot._replacedDisplayDataSet.length = slot._displayDataSet.displays.length;
                armature.addSlot(slot, slotData.parent.name);
            }
        };
        /**
         * @private
         */
        BaseFactory.prototype._replaceSlotDisplay = function (dataPackage, displayData, slot, displayIndex) {
            if (displayIndex < 0) {
                displayIndex = slot.displayIndex;
            }
            if (displayIndex >= 0) {
                var displayList = slot.displayList; // Copy.
                if (displayList.length <= displayIndex) {
                    displayList.length = displayIndex + 1;
                }
                if (!displayData.textureData) {
                    displayData.textureData = this._getTextureData(dataPackage.dataName, displayData.name);
                }
                if (displayData.type == 1 /* Armature */) {
                    var childArmature = this.buildArmature(displayData.name, dataPackage.dataName);
                    displayList[displayIndex] = childArmature;
                }
                else {
                    if (slot._replacedDisplayDataSet.length <= displayIndex) {
                        slot._replacedDisplayDataSet.length = displayIndex + 1;
                    }
                    slot._replacedDisplayDataSet[displayIndex] = displayData;
                    if (displayData.meshData) {
                        displayList[displayIndex] = slot.MeshDisplay;
                    }
                    else {
                        displayList[displayIndex] = slot.rawDisplay;
                    }
                }
                slot.displayList = displayList;
                slot.invalidUpdate();
            }
        };
        /**
         * @language zh_CN
         * 解析并添加龙骨数据。
         * @param rawData 需要解析的原始数据。 (JSON)
         * @param dragonBonesName 为数据提供一个名称，以便可以通过这个名称来获取数据，状态，则使用数据中的名称。
         * @returns DragonBonesData
         * @see #getDragonBonesData()
         * @see #addDragonBonesData()
         * @see #removeDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 4.5
         */
        BaseFactory.prototype.parseDragonBonesData = function (rawData, dragonBonesName) {
            if (dragonBonesName === void 0) { dragonBonesName = null; }
            var dragonBonesData = this._objectDataParser.parseDragonBonesData(rawData);
            this.addDragonBonesData(dragonBonesData, dragonBonesName);
            return dragonBonesData;
        };
        /**
         * @language zh_CN
         * 解析并添加贴图集数据。
         * @param rawData 需要解析的原始数据。 (JSON)
         * @param textureAtlas 贴图集数据。 (JSON)
         * @param name 为数据指定一个名称，以便可以通过这个名称来访问数据，如果未设置，则使用数据中的名称。
         * @param scale 为贴图集设置一个缩放值。
         * @returns 贴图集数据
         * @see #getTextureAtlasData()
         * @see #addTextureAtlasData()
         * @see #removeTextureAtlasData()
         * @see dragonBones.TextureAtlasData
         * @version DragonBones 4.5
         */
        BaseFactory.prototype.parseTextureAtlasData = function (rawData, textureAtlas, name, scale) {
            if (name === void 0) { name = null; }
            if (scale === void 0) { scale = 0; }
            var textureAtlasData = this._generateTextureAtlasData(null, null);
            this._objectDataParser.parseTextureAtlasData(rawData, textureAtlasData, scale);
            this._generateTextureAtlasData(textureAtlasData, textureAtlas);
            this.addTextureAtlasData(textureAtlasData, name);
            return textureAtlasData;
        };
        /**
         * @language zh_CN
         * 获取指定名称的龙骨数据。
         * @param name 数据名称。
         * @returns DragonBonesData
         * @see #parseDragonBonesData()
         * @see #addDragonBonesData()
         * @see #removeDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 3.0
         */
        BaseFactory.prototype.getDragonBonesData = function (name) {
            return this._dragonBonesDataMap[name];
        };
        /**
         * @language zh_CN
         * 添加龙骨数据。
         * @param data 龙骨数据。
         * @param dragonBonesName 为数据指定一个名称，以便可以通过这个名称来访问数据，如果未设置，则使用数据中的名称。
         * @see #parseDragonBonesData()
         * @see #getDragonBonesData()
         * @see #removeDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 3.0
         */
        BaseFactory.prototype.addDragonBonesData = function (data, dragonBonesName) {
            if (dragonBonesName === void 0) { dragonBonesName = null; }
            if (data) {
                dragonBonesName = dragonBonesName || data.name;
                if (dragonBonesName) {
                    if (!this._dragonBonesDataMap[dragonBonesName]) {
                        this._dragonBonesDataMap[dragonBonesName] = data;
                    }
                    else {
                        console.warn("Same name data.");
                    }
                }
                else {
                    console.warn("Unnamed data.");
                }
            }
            else {
                throw new Error();
            }
        };
        /**
         * @language zh_CN
         * 移除龙骨数据。
         * @param dragonBonesName 数据名称。
         * @param disposeData 是否释放数据。 [false: 不释放, true: 释放]
         * @see #parseDragonBonesData()
         * @see #getDragonBonesData()
         * @see #addDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 3.0
         */
        BaseFactory.prototype.removeDragonBonesData = function (dragonBonesName, disposeData) {
            if (disposeData === void 0) { disposeData = true; }
            var dragonBonesData = this._dragonBonesDataMap[dragonBonesName];
            if (dragonBonesData) {
                if (disposeData) {
                    if (dragonBones.DragonBones.DEBUG) {
                        for (var i = 0, l = dragonBones.DragonBones._armatures.length; i < l; ++i) {
                            var armature = dragonBones.DragonBones._armatures[i];
                            if (armature.armatureData.parent == dragonBonesData) {
                                throw new Error("ArmatureData: " + armature.armatureData.name + " DragonBonesData: " + dragonBonesName);
                            }
                        }
                    }
                    dragonBonesData.returnToPool();
                }
                delete this._dragonBonesDataMap[dragonBonesName];
            }
        };
        /**
         * @language zh_CN
         * 获取指定名称的贴图集数据列表。
         * @param dragonBonesName 数据名称。
         * @returns 贴图集数据列表。
         * @see #parseTextureAtlasData()
         * @see #addTextureAtlasData()
         * @see #removeTextureAtlasData()
         * @see dragonBones.textures.TextureAtlasData
         * @version DragonBones 3.0
         */
        BaseFactory.prototype.getTextureAtlasData = function (dragonBonesName) {
            return this._textureAtlasDataMap[dragonBonesName];
        };
        /**
         * @language zh_CN
         * 添加贴图集数据。
         * @param data 贴图集数据。
         * @param dragonBonesName 为数据指定一个名称，以便可以通过这个名称来访问数据，如果未设置，则使用数据中的名称。
         * @see #parseTextureAtlasData()
         * @see #getTextureAtlasData()
         * @see #removeTextureAtlasData()
         * @see dragonBones.textures.TextureAtlasData
         * @version DragonBones 3.0
         */
        BaseFactory.prototype.addTextureAtlasData = function (data, dragonBonesName) {
            if (dragonBonesName === void 0) { dragonBonesName = null; }
            if (data) {
                dragonBonesName = dragonBonesName || data.name;
                if (dragonBonesName) {
                    var textureAtlasList = this._textureAtlasDataMap[dragonBonesName] = this._textureAtlasDataMap[dragonBonesName] || [];
                    if (textureAtlasList.indexOf(data) < 0) {
                        textureAtlasList.push(data);
                    }
                }
                else {
                    console.warn("Unnamed data.");
                }
            }
            else {
                throw new Error();
            }
        };
        /**
         * @language zh_CN
         * 移除贴图集数据。
         * @param dragonBonesName 数据名称。
         * @param disposeData 是否释放数据。 [false: 不释放, true: 释放]
         * @see #parseTextureAtlasData()
         * @see #getTextureAtlasData()
         * @see #addTextureAtlasData()
         * @see dragonBones.textures.TextureAtlasData
         * @version DragonBones 3.0
         */
        BaseFactory.prototype.removeTextureAtlasData = function (dragonBonesName, disposeData) {
            if (disposeData === void 0) { disposeData = true; }
            var textureAtlasDataList = this._textureAtlasDataMap[dragonBonesName];
            if (textureAtlasDataList) {
                if (disposeData) {
                    for (var i = 0, l = textureAtlasDataList.length; i < l; ++i) {
                        textureAtlasDataList[i].returnToPool();
                    }
                }
                delete this._textureAtlasDataMap[dragonBonesName];
            }
        };
        /**
         * @language zh_CN
         * 清除所有的数据。
         * @param disposeData 是否释放数据。 [false: 不释放, true: 释放]
         * @version DragonBones 4.5
         */
        BaseFactory.prototype.clear = function (disposeData) {
            if (disposeData === void 0) { disposeData = true; }
            for (var i in this._dragonBonesDataMap) {
                if (disposeData) {
                    this._dragonBonesDataMap[i].returnToPool();
                }
                delete this._dragonBonesDataMap[i];
            }
            for (var i in this._textureAtlasDataMap) {
                if (disposeData) {
                    var textureAtlasDataList = this._textureAtlasDataMap[i];
                    for (var i_5 = 0, l = textureAtlasDataList.length; i_5 < l; ++i_5) {
                        textureAtlasDataList[i_5].returnToPool();
                    }
                }
                delete this._textureAtlasDataMap[i];
            }
        };
        /**
         * @language zh_CN
         * 创建一个指定名称的骨架。
         * @param armatureName 骨架数据名称。
         * @param dragonBonesName 龙骨数据名称，如果未设置，将检索所有的龙骨数据，当多个龙骨数据中包含同名的骨架数据时，可能无法创建出准确的骨架。
         * @param skinName 皮肤名称，如果未设置，则使用默认皮肤。
         * @returns 骨架
         * @see dragonBones.Armature
         * @version DragonBones 3.0
         */
        BaseFactory.prototype.buildArmature = function (armatureName, dragonBonesName, skinName) {
            if (dragonBonesName === void 0) { dragonBonesName = null; }
            if (skinName === void 0) { skinName = null; }
            var dataPackage = {};
            if (this._fillBuildArmaturePackage(dragonBonesName, armatureName, skinName, dataPackage)) {
                var armature = this._generateArmature(dataPackage);
                this._buildBones(dataPackage, armature);
                this._buildSlots(dataPackage, armature);
                if (armature.armatureData.actions.length > 0) {
                    armature._action = armature.armatureData.actions[armature.armatureData.actions.length - 1];
                }
                armature.advanceTime(0); // Update armature pose.
                return armature;
            }
            return null;
        };
        /**
         * @language zh_CN
         * 将指定骨架的动画替换成其他骨架的动画。 (通常这些骨架应该具有相同的骨架结构)
         * @param toArmature 指定的骨架。
         * @param fromArmatreName 其他骨架的名称。
         * @param fromSkinName 其他骨架的皮肤名称，如果未设置，则使用默认皮肤。
         * @param fromDragonBonesDataName 其他骨架属于的龙骨数据名称，如果未设置，则检索所有的龙骨数据。
         * @param ifRemoveOriginalAnimationList 是否移除原有的动画。 [true: 移除, false: 不移除]
         * @returns 是否替换成功。 [true: 成功, false: 不成功]
         * @see dragonBones.Armature
         * @version DragonBones 4.5
         */
        BaseFactory.prototype.copyAnimationsToArmature = function (toArmature, fromArmatreName, fromSkinName, fromDragonBonesDataName, ifRemoveOriginalAnimationList) {
            if (fromSkinName === void 0) { fromSkinName = null; }
            if (fromDragonBonesDataName === void 0) { fromDragonBonesDataName = null; }
            if (ifRemoveOriginalAnimationList === void 0) { ifRemoveOriginalAnimationList = true; }
            var dataPackage = {};
            if (this._fillBuildArmaturePackage(fromDragonBonesDataName, fromArmatreName, fromSkinName, dataPackage)) {
                var fromArmatureData = dataPackage.armature;
                if (ifRemoveOriginalAnimationList) {
                    toArmature.animation.animations = fromArmatureData.animations;
                }
                else {
                    var animations = {};
                    for (var animationName in toArmature.animation.animations) {
                        animations[animationName] = toArmature.animation.animations[animationName];
                    }
                    for (var animationName in fromArmatureData.animations) {
                        animations[animationName] = fromArmatureData.animations[animationName];
                    }
                    toArmature.animation.animations = animations;
                }
                if (dataPackage.skin) {
                    var slots = toArmature.getSlots();
                    for (var i = 0, l = slots.length; i < l; ++i) {
                        var toSlot = slots[i];
                        var toSlotDisplayList = toSlot.displayList;
                        for (var i_6 = 0, l_4 = toSlotDisplayList.length; i_6 < l_4; ++i_6) {
                            var toDisplayObject = toSlotDisplayList[i_6];
                            if (toDisplayObject instanceof dragonBones.Armature) {
                                var displays = dataPackage.skin.getSlot(toSlot.name).displays;
                                if (i_6 < displays.length) {
                                    var fromDisplayData = displays[i_6];
                                    if (fromDisplayData.type == 1 /* Armature */) {
                                        this.copyAnimationsToArmature(toDisplayObject, fromDisplayData.name, fromSkinName, fromDragonBonesDataName, ifRemoveOriginalAnimationList);
                                    }
                                }
                            }
                        }
                    }
                    return true;
                }
            }
            return false;
        };
        /**
         * @language zh_CN
         * 将指定插槽的显示对象替换为指定资源创造出的显示对象。
         * @param dragonBonesName 指定的龙骨数据名称。
         * @param armatureName 指定的骨架名称。
         * @param slotName 指定的插槽名称。
         * @param displayName 指定的显示对象名称。
         * @param slot 指定的插槽实例。
         * @param displayIndex 要替换的显示对象的索引，如果未设置，则替换当前正在显示的显示对象。
         * @version DragonBones 4.5
         */
        BaseFactory.prototype.replaceSlotDisplay = function (dragonBonesName, armatureName, slotName, displayName, slot, displayIndex) {
            if (displayIndex === void 0) { displayIndex = -1; }
            var dataPackage = {};
            if (this._fillBuildArmaturePackage(dragonBonesName, armatureName, null, dataPackage)) {
                var slotDisplayDataSet = dataPackage.skin.getSlot(slotName);
                if (slotDisplayDataSet) {
                    for (var i = 0, l = slotDisplayDataSet.displays.length; i < l; ++i) {
                        var displayData = slotDisplayDataSet.displays[i];
                        if (displayData.name == displayName) {
                            this._replaceSlotDisplay(dataPackage, displayData, slot, displayIndex);
                            break;
                        }
                    }
                }
            }
        };
        /**
         * @language zh_CN
         * 将指定插槽的显示对象列表替换为指定资源创造出的显示对象列表。
         * @param dragonBonesName 指定的 DragonBonesData 名称。
         * @param armatureName 指定的骨架名称。
         * @param slotName 指定的插槽名称。
         * @param slot 指定的插槽实例。
         * @version DragonBones 4.5
         */
        BaseFactory.prototype.replaceSlotDisplayList = function (dragonBonesName, armatureName, slotName, slot) {
            var dataPackage = {};
            if (this._fillBuildArmaturePackage(dragonBonesName, armatureName, null, dataPackage)) {
                var slotDisplayDataSet = dataPackage.skin.getSlot(slotName);
                if (slotDisplayDataSet) {
                    var displayIndex = 0;
                    for (var i = 0, l = slotDisplayDataSet.displays.length; i < l; ++i) {
                        var displayData = slotDisplayDataSet.displays[i];
                        this._replaceSlotDisplay(dataPackage, displayData, slot, displayIndex++);
                    }
                }
            }
        };
        /**
         * @deprecated
         * @see #clear()
         */
        BaseFactory.prototype.dispose = function () {
            this.clear();
        };
        return BaseFactory;
    }());
    dragonBones.BaseFactory = BaseFactory;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    var ColorTransform = (function () {
        function ColorTransform(alphaMultiplier, redMultiplier, greenMultiplier, blueMultiplier, alphaOffset, redOffset, greenOffset, blueOffset) {
            if (alphaMultiplier === void 0) { alphaMultiplier = 1; }
            if (redMultiplier === void 0) { redMultiplier = 1; }
            if (greenMultiplier === void 0) { greenMultiplier = 1; }
            if (blueMultiplier === void 0) { blueMultiplier = 1; }
            if (alphaOffset === void 0) { alphaOffset = 0; }
            if (redOffset === void 0) { redOffset = 0; }
            if (greenOffset === void 0) { greenOffset = 0; }
            if (blueOffset === void 0) { blueOffset = 0; }
            this.alphaMultiplier = alphaMultiplier;
            this.redMultiplier = redMultiplier;
            this.greenMultiplier = greenMultiplier;
            this.blueMultiplier = blueMultiplier;
            this.alphaOffset = alphaOffset;
            this.redOffset = redOffset;
            this.greenOffset = greenOffset;
            this.blueOffset = blueOffset;
        }
        ColorTransform.prototype.copyFrom = function (value) {
            this.alphaMultiplier = value.alphaMultiplier;
            this.redMultiplier = value.redMultiplier;
            this.greenMultiplier = value.greenMultiplier;
            this.blueMultiplier = value.blueMultiplier;
            this.alphaOffset = value.alphaOffset;
            this.redOffset = value.redOffset;
            this.redOffset = value.redOffset;
            this.greenOffset = value.blueOffset;
        };
        ColorTransform.prototype.identity = function () {
            this.alphaMultiplier = this.redMultiplier = this.greenMultiplier = this.blueMultiplier = 1;
            this.alphaOffset = this.redOffset = this.greenOffset = this.blueOffset = 0;
        };
        return ColorTransform;
    }());
    dragonBones.ColorTransform = ColorTransform;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 2D 矩阵。
     * @version DragonBones 3.0
     */
    var Matrix = (function () {
        function Matrix(a, b, c, d, tx, ty) {
            if (a === void 0) { a = 1; }
            if (b === void 0) { b = 0; }
            if (c === void 0) { c = 0; }
            if (d === void 0) { d = 1; }
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = 0; }
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        }
        /**
         * @language zh_CN
         * 复制矩阵。
         * @param value 需要复制的矩阵。
         * @version DragonBones 3.0
         */
        Matrix.prototype.copyFrom = function (value) {
            this.a = value.a;
            this.b = value.b;
            this.c = value.c;
            this.d = value.d;
            this.tx = value.tx;
            this.ty = value.ty;
        };
        /**
         * @language zh_CN
         * 转换为恒等矩阵。
         * @version DragonBones 3.0
         */
        Matrix.prototype.identity = function () {
            this.a = this.d = 1;
            this.b = this.c = 0;
            this.tx = this.ty = 0;
        };
        /**
         * @language zh_CN
         * 将当前矩阵与另一个矩阵相乘。
         * @param value 需要相乘的矩阵。
         * @version DragonBones 3.0
         */
        Matrix.prototype.concat = function (value) {
            var aA = this.a;
            var bA = this.b;
            var cA = this.c;
            var dA = this.d;
            var txA = this.tx;
            var tyA = this.ty;
            var aB = value.a;
            var bB = value.b;
            var cB = value.c;
            var dB = value.d;
            var txB = value.tx;
            var tyB = value.ty;
            this.a = aA * aB + bA * cB;
            this.b = aA * bB + bA * dB;
            this.c = cA * aB + dA * cB;
            this.d = cA * bB + dA * dB;
            this.tx = aB * txA + cB * tyA + txB;
            this.ty = dB * tyA + bB * txA + tyB;
            /*
            [
                this.a,
                this.b,
                this.c,
                this.d,
                this.tx,
                this.ty
            ] = [
                this.a * value.a + this.b * value.c,
                this.a * value.b + this.b * value.d,
                this.c * value.a + this.d * value.c,
                this.c * value.b + this.d * value.d,
                value.a * this.tx + value.c * this.tx + value.tx,
                value.d * this.ty + value.b * this.ty + value.ty
            ];
            */
        };
        /**
         * @language zh_CN
         * 转换为逆矩阵。
         * @version DragonBones 3.0
         */
        Matrix.prototype.invert = function () {
            var aA = this.a;
            var bA = this.b;
            var cA = this.c;
            var dA = this.d;
            var txA = this.tx;
            var tyA = this.ty;
            var n = aA * dA - bA * cA;
            this.a = dA / n;
            this.b = -bA / n;
            this.c = -cA / n;
            this.d = aA / n;
            this.tx = (cA * tyA - dA * txA) / n;
            this.ty = -(aA * tyA - bA * txA) / n;
        };
        /**
         * @language zh_CN
         * 将矩阵转换应用于指定点。
         * @param x 横坐标。
         * @param y 纵坐标。
         * @param result 应用转换之后的坐标。
         * @params delta 是否忽略 tx，ty 对坐标的转换。
         * @version DragonBones 3.0
         */
        Matrix.prototype.transformPoint = function (x, y, result, delta) {
            if (delta === void 0) { delta = false; }
            result.x = this.a * x + this.c * y;
            result.y = this.b * x + this.d * y;
            if (!delta) {
                result.x += this.tx;
                result.y += this.ty;
            }
        };
        return Matrix;
    }());
    dragonBones.Matrix = Matrix;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    var Point = (function () {
        function Point(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        Point.prototype.copyFrom = function (value) {
            this.x = value.x;
            this.y = value.y;
        };
        Point.prototype.clear = function () {
            this.x = this.y = 0;
        };
        return Point;
    }());
    dragonBones.Point = Point;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    var Rectangle = (function () {
        function Rectangle(x, y, width, height) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        Rectangle.prototype.copyFrom = function (value) {
            this.x = value.x;
            this.y = value.y;
            this.width = value.width;
            this.height = value.height;
        };
        Rectangle.prototype.clear = function () {
            this.x = this.y = 0;
            this.width = this.height = 0;
        };
        return Rectangle;
    }());
    dragonBones.Rectangle = Rectangle;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 2D 变换。
     * @version DragonBones 3.0
     */
    var Transform = (function () {
        /**
         * @private
         */
        function Transform(
            /**
             * @language zh_CN
             * 水平位移。
             * @version DragonBones 3.0
             */
            x, 
            /**
             * @language zh_CN
             * 垂直位移。
             * @version DragonBones 3.0
             */
            y, 
            /**
             * @language zh_CN
             * 水平倾斜。 (以弧度为单位)
             * @version DragonBones 3.0
             */
            skewX, 
            /**
             * @language zh_CN
             * 垂直倾斜。 (以弧度为单位)
             * @version DragonBones 3.0
             */
            skewY, 
            /**
             * @language zh_CN
             * 水平缩放。
             * @version DragonBones 3.0
             */
            scaleX, 
            /**
             * @language zh_CN
             * 垂直缩放。
             * @version DragonBones 3.0
             */
            scaleY) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (skewX === void 0) { skewX = 0; }
            if (skewY === void 0) { skewY = 0; }
            if (scaleX === void 0) { scaleX = 1; }
            if (scaleY === void 0) { scaleY = 1; }
            this.x = x;
            this.y = y;
            this.skewX = skewX;
            this.skewY = skewY;
            this.scaleX = scaleX;
            this.scaleY = scaleY;
        }
        /**
         * @private
         */
        Transform.normalizeRadian = function (value) {
            value = (value + Math.PI) % (Math.PI * 2);
            value += value > 0 ? -Math.PI : Math.PI;
            return value;
        };
        /**
         * @private
         */
        Transform.prototype.toString = function () {
            return "[object dragonBones.Transform] x:" + this.x + " y:" + this.y + " skewX:" + this.skewX * 180 / Math.PI + " skewY:" + this.skewY * 180 / Math.PI + " scaleX:" + this.scaleX + " scaleY:" + this.scaleY;
        };
        /**
         * @private
         */
        Transform.prototype.copyFrom = function (value) {
            this.x = value.x;
            this.y = value.y;
            this.skewX = value.skewX;
            this.skewY = value.skewY;
            this.scaleX = value.scaleX;
            this.scaleY = value.scaleY;
            return this;
        };
        /**
         * @private
         */
        Transform.prototype.clone = function () {
            var value = new Transform();
            value.copyFrom(this);
            return value;
        };
        /**
         * @private
         */
        Transform.prototype.identity = function () {
            this.x = this.y = this.skewX = this.skewY = 0;
            this.scaleX = this.scaleY = 1;
            return this;
        };
        /**
         * @private
         */
        Transform.prototype.add = function (value) {
            this.x += value.x;
            this.y += value.y;
            this.skewX += value.skewX;
            this.skewY += value.skewY;
            this.scaleX *= value.scaleX;
            this.scaleY *= value.scaleY;
            return this;
        };
        /**
         * @private
         */
        Transform.prototype.minus = function (value) {
            this.x -= value.x;
            this.y -= value.y;
            this.skewX = Transform.normalizeRadian(this.skewX - value.skewX);
            this.skewY = Transform.normalizeRadian(this.skewY - value.skewY);
            this.scaleX /= value.scaleX;
            this.scaleY /= value.scaleY;
            return this;
        };
        /**
         * @private
         */
        Transform.prototype.fromMatrix = function (matrix) {
            var PI_Q = Math.PI * 0.25;
            var backupScaleX = this.scaleX, backupScaleY = this.scaleY;
            this.x = matrix.tx;
            this.y = matrix.ty;
            this.skewX = Math.atan(-matrix.c / matrix.d);
            this.skewY = Math.atan(matrix.b / matrix.a);
            if (this.skewX != this.skewX)
                this.skewX = 0;
            if (this.skewY != this.skewY)
                this.skewY = 0;
            this.scaleY = (this.skewX > -PI_Q && this.skewX < PI_Q) ? matrix.d / Math.cos(this.skewX) : -matrix.c / Math.sin(this.skewX);
            this.scaleX = (this.skewY > -PI_Q && this.skewY < PI_Q) ? matrix.a / Math.cos(this.skewY) : matrix.b / Math.sin(this.skewY);
            if (backupScaleX >= 0 && this.scaleX < 0) {
                this.scaleX = -this.scaleX;
                this.skewY = this.skewY - Math.PI;
            }
            if (backupScaleY >= 0 && this.scaleY < 0) {
                this.scaleY = -this.scaleY;
                this.skewX = this.skewX - Math.PI;
            }
            return this;
        };
        /**
         * @language zh_CN
         * 转换为矩阵。
         * @param 矩阵。
         * @version DragonBones 3.0
         */
        Transform.prototype.toMatrix = function (matrix) {
            matrix.a = this.scaleX * Math.cos(this.skewY);
            matrix.b = this.scaleX * Math.sin(this.skewY);
            matrix.c = -this.scaleY * Math.sin(this.skewX);
            matrix.d = this.scaleY * Math.cos(this.skewX);
            matrix.tx = this.x;
            matrix.ty = this.y;
        };
        Object.defineProperty(Transform.prototype, "rotation", {
            /**
             * @language zh_CN
             * 旋转。 (以弧度为单位)
             * @version DragonBones 3.0
             */
            get: function () {
                return this.skewY;
            },
            set: function (value) {
                var dValue = value - this.skewY;
                this.skewX += dValue;
                this.skewY += dValue;
            },
            enumerable: true,
            configurable: true
        });
        return Transform;
    }());
    dragonBones.Transform = Transform;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 动画数据。
     * @version DragonBones 3.0
     */
    var AnimationData = (function (_super) {
        __extends(AnimationData, _super);
        /**
         * @private
         */
        function AnimationData() {
            _super.call(this);
            /**
             * @private
             */
            this.boneTimelines = {};
            /**
             * @private
             */
            this.slotTimelines = {};
            /**
             * @private
             */
            this.ffdTimelines = {}; // skin slot displayIndex
            /**
             * @private
             */
            this.cachedFrames = [];
        }
        /**
         * @private
         */
        AnimationData.toString = function () {
            return "[Class dragonBones.AnimationData]";
        };
        /**
         * @inheritDoc
         */
        AnimationData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.hasAsynchronyTimeline = false;
            this.cacheTimeToFrameScale = 0;
            this.position = 0;
            this.duration = 0;
            this.playTimes = 0;
            this.fadeInTime = 0;
            this.name = null;
            this.animation = null;
            for (var i in this.boneTimelines) {
                this.boneTimelines[i].returnToPool();
                delete this.boneTimelines[i];
            }
            for (var i in this.slotTimelines) {
                this.slotTimelines[i].returnToPool();
                delete this.slotTimelines[i];
            }
            for (var i in this.ffdTimelines) {
                for (var j in this.ffdTimelines[i]) {
                    for (var k in this.ffdTimelines[i][j]) {
                        this.ffdTimelines[i][j][k].returnToPool();
                    }
                }
                delete this.ffdTimelines[i];
            }
            if (this.cachedFrames.length) {
                this.cachedFrames.length = 0;
            }
        };
        /**
         * @private
         */
        AnimationData.prototype.cacheFrames = function (value) {
            if (this.animation) {
                return;
            }
            var cacheFrameCount = Math.max(Math.floor(this.frameCount * this.scale * value), 1);
            this.cacheTimeToFrameScale = cacheFrameCount / (this.duration + 0.000001); //
            this.cachedFrames.length = 0;
            this.cachedFrames.length = cacheFrameCount;
            for (var i in this.boneTimelines) {
                this.boneTimelines[i].cacheFrames(cacheFrameCount);
            }
            for (var i in this.slotTimelines) {
                this.slotTimelines[i].cacheFrames(cacheFrameCount);
            }
        };
        /**
         * @private
         */
        AnimationData.prototype.addBoneTimeline = function (value) {
            if (value && value.bone && !this.boneTimelines[value.bone.name]) {
                this.boneTimelines[value.bone.name] = value;
            }
            else {
                throw new Error();
            }
        };
        /**
         * @private
         */
        AnimationData.prototype.addSlotTimeline = function (value) {
            if (value && value.slot && !this.slotTimelines[value.slot.name]) {
                this.slotTimelines[value.slot.name] = value;
            }
            else {
                throw new Error();
            }
        };
        /**
         * @private
         */
        AnimationData.prototype.addFFDTimeline = function (value) {
            if (value && value.skin && value.slot) {
                var skin = this.ffdTimelines[value.skin.name] = this.ffdTimelines[value.skin.name] || {};
                var slot = skin[value.slot.slot.name] = skin[value.slot.slot.name] || {};
                if (!slot[value.displayIndex]) {
                    slot[value.displayIndex] = value;
                }
                else {
                    throw new Error();
                }
            }
            else {
                throw new Error();
            }
        };
        /**
         * @private
         */
        AnimationData.prototype.getBoneTimeline = function (name) {
            return this.boneTimelines[name];
        };
        /**
         * @private
         */
        AnimationData.prototype.getSlotTimeline = function (name) {
            return this.slotTimelines[name];
        };
        /**
         * @private
         */
        AnimationData.prototype.getFFDTimeline = function (skinName, slotName, displayIndex) {
            var skin = this.ffdTimelines[skinName];
            if (skin) {
                var slot = skin[slotName];
                if (slot) {
                    return slot[displayIndex];
                }
            }
            return null;
        };
        return AnimationData;
    }(dragonBones.TimelineData));
    dragonBones.AnimationData = AnimationData;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 骨架数据。
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     */
    var ArmatureData = (function (_super) {
        __extends(ArmatureData, _super);
        /**
         * @private
         */
        function ArmatureData() {
            _super.call(this);
            /**
             * @private
             */
            this.parent = null;
            /**
             * @language zh_CN
             * 所有的骨骼数据。
             * @see dragonBones.BoneData
             * @version DragonBones 3.0
             */
            this.bones = {};
            /**
             * @language zh_CN
             * 所有的插槽数据。
             * @see dragonBones.SlotData
             * @version DragonBones 3.0
             */
            this.slots = {};
            /**
             * @language zh_CN
             * 所有的皮肤数据。
             * @see dragonBones.SkinData
             * @version DragonBones 3.0
             */
            this.skins = {};
            /**
             * @language zh_CN
             * 所有的动画数据。
             * @see dragonBones.AnimationData
             * @version DragonBones 3.0
             */
            this.animations = {};
            /**
             * @private
             */
            this.actions = [];
            this._sortedBones = [];
            this._sortedSlots = [];
            this._bonesChildren = {};
        }
        ArmatureData._onSortSlots = function (a, b) {
            return a.zOrder > b.zOrder ? 1 : -1;
        };
        /**
         * @private
         */
        ArmatureData.toString = function () {
            return "[Class dragonBones.ArmatureData]";
        };
        /**
         * @inheritDoc
         */
        ArmatureData.prototype._onClear = function () {
            this.frameRate = 0;
            this.cacheFrameRate = 0;
            this.type = 0 /* Armature */;
            this.name = null;
            this.parent = null;
            for (var i in this.bones) {
                this.bones[i].returnToPool();
                delete this.bones[i];
            }
            for (var i in this.slots) {
                this.slots[i].returnToPool();
                delete this.slots[i];
            }
            for (var i in this.skins) {
                this.skins[i].returnToPool();
                delete this.skins[i];
            }
            for (var i in this.animations) {
                this.animations[i].returnToPool();
                delete this.animations[i];
            }
            if (this.actions.length) {
                for (var i = 0, l = this.actions.length; i < l; ++i) {
                    this.actions[i].returnToPool();
                }
                this.actions.length = 0;
            }
            this._boneDirty = false;
            this._slotDirty = false;
            this._defaultSkin = null;
            this._defaultAnimation = null;
            if (this._sortedBones.length) {
                this._sortedBones.length = 0;
            }
            if (this._sortedSlots.length) {
                this._sortedSlots.length = 0;
            }
            for (var i in this._bonesChildren) {
                delete this._bonesChildren[i];
            }
        };
        ArmatureData.prototype._sortBones = function () {
            var total = this._sortedBones.length;
            if (!total) {
                return;
            }
            var sortHelper = this._sortedBones.concat();
            var index = 0;
            var count = 0;
            this._sortedBones.length = 0;
            while (count < total) {
                var bone = sortHelper[index++];
                if (index >= total) {
                    index = 0;
                }
                if (this._sortedBones.indexOf(bone) >= 0) {
                    continue;
                }
                if (bone.parent && this._sortedBones.indexOf(bone.parent) < 0) {
                    continue;
                }
                if (bone.ik && this._sortedBones.indexOf(bone.ik) < 0) {
                    continue;
                }
                if (bone.ik && bone.chain > 0 && bone.chainIndex == bone.chain) {
                    this._sortedBones.splice(this._sortedBones.indexOf(bone.parent) + 1, 0, bone);
                }
                else {
                    this._sortedBones.push(bone);
                }
                count++;
            }
        };
        ArmatureData.prototype._sortSlots = function () {
            this._sortedSlots.sort(ArmatureData._onSortSlots);
        };
        /**
         * @private
         */
        ArmatureData.prototype.cacheFrames = function (value) {
            if (this.cacheFrameRate == value) {
                return;
            }
            this.cacheFrameRate = value;
            var frameScale = this.cacheFrameRate / this.frameRate;
            for (var i in this.animations) {
                this.animations[i].cacheFrames(frameScale);
            }
        };
        /**
         * @private
         */
        ArmatureData.prototype.addBone = function (value, parentName) {
            if (value && value.name && !this.bones[value.name]) {
                if (parentName) {
                    var parent_1 = this.getBone(parentName);
                    if (parent_1) {
                        value.parent = parent_1;
                    }
                    else {
                        (this._bonesChildren[parentName] = this._bonesChildren[parentName] || []).push(value);
                    }
                }
                var children = this._bonesChildren[value.name];
                if (children) {
                    for (var i = 0, l = children.length; i < l; ++i) {
                        children[i].parent = value;
                    }
                    delete this._bonesChildren[value.name];
                }
                this.bones[value.name] = value;
                this._sortedBones.push(value);
                this._boneDirty = true;
            }
            else {
                throw new Error();
            }
        };
        /**
         * @private
         */
        ArmatureData.prototype.addSlot = function (value) {
            if (value && value.name && !this.slots[value.name]) {
                this.slots[value.name] = value;
                this._sortedSlots.push(value);
                this._slotDirty = true;
            }
            else {
                throw new Error();
            }
        };
        /**
         * @private
         */
        ArmatureData.prototype.addSkin = function (value) {
            if (value && value.name && !this.skins[value.name]) {
                this.skins[value.name] = value;
                if (!this._defaultSkin) {
                    this._defaultSkin = value;
                }
            }
            else {
                throw new Error();
            }
        };
        /**
         * @private
         */
        ArmatureData.prototype.addAnimation = function (value) {
            if (value && value.name && !this.animations[value.name]) {
                this.animations[value.name] = value;
                if (!this._defaultAnimation) {
                    this._defaultAnimation = value;
                }
            }
            else {
                throw new Error();
            }
        };
        /**
         * @language zh_CN
         * 获取指定名称的骨骼数据。
         * @param name 骨骼数据名称。
         * @see dragonBones.BoneData
         * @version DragonBones 3.0
         */
        ArmatureData.prototype.getBone = function (name) {
            return this.bones[name];
        };
        /**
         * @language zh_CN
         * 获取指定名称的插槽数据。
         * @param name 插槽数据名称。
         * @see dragonBones.SlotData
         * @version DragonBones 3.0
         */
        ArmatureData.prototype.getSlot = function (name) {
            return this.slots[name];
        };
        /**
         * @language zh_CN
         * 获取指定名称的皮肤数据。
         * @param name 皮肤数据名称。
         * @see dragonBones.SkinData
         * @version DragonBones 3.0
         */
        ArmatureData.prototype.getSkin = function (name) {
            return name ? this.skins[name] : this._defaultSkin;
        };
        /**
         * @language zh_CN
         * 获取指定名称的动画数据。
         * @param name 动画数据名称。
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         */
        ArmatureData.prototype.getAnimation = function (name) {
            return name ? this.animations[name] : this._defaultAnimation;
        };
        Object.defineProperty(ArmatureData.prototype, "sortedBones", {
            /**
             * @private
             */
            get: function () {
                if (this._boneDirty) {
                    this._boneDirty = false;
                    this._sortBones();
                }
                return this._sortedBones;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArmatureData.prototype, "sortedSlots", {
            /**
             * @private
             */
            get: function () {
                if (this._slotDirty) {
                    this._slotDirty = false;
                    this._sortSlots();
                }
                return this._sortedSlots;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArmatureData.prototype, "defaultSkin", {
            /**
             * @language zh_CN
             * 获取默认的皮肤数据。
             * @see dragonBones.SkinData
             * @version DragonBones 4.5
             */
            get: function () {
                return this._defaultSkin;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArmatureData.prototype, "defaultAnimation", {
            /**
             * @language zh_CN
             * 获取默认的动画数据。
             * @see dragonBones.AnimationData
             * @version DragonBones 4.5
             */
            get: function () {
                return this._defaultAnimation;
            },
            enumerable: true,
            configurable: true
        });
        return ArmatureData;
    }(dragonBones.BaseObject));
    dragonBones.ArmatureData = ArmatureData;
    /**
     * @language zh_CN
     * 骨骼数据。
     * @see dragonBones.Bone
     * @version DragonBones 3.0
     */
    var BoneData = (function (_super) {
        __extends(BoneData, _super);
        /**
         * @private
         */
        function BoneData() {
            _super.call(this);
            /**
             * @private
             */
            this.transform = new dragonBones.Transform();
        }
        /**
         * @private
         */
        BoneData.toString = function () {
            return "[Class dragonBones.BoneData]";
        };
        /**
         * @inheritDoc
         */
        BoneData.prototype._onClear = function () {
            this.inheritTranslation = false;
            this.inheritRotation = false;
            this.inheritScale = false;
            this.bendPositive = false;
            this.chain = 0;
            this.chainIndex = 0;
            this.weight = 0;
            this.length = 0;
            this.name = null;
            this.parent = null;
            this.ik = null;
            this.transform.identity();
        };
        return BoneData;
    }(dragonBones.BaseObject));
    dragonBones.BoneData = BoneData;
    /**
     * @language zh_CN
     * 插槽数据。
     * @see dragonBones.Slot
     * @version DragonBones 3.0
     */
    var SlotData = (function (_super) {
        __extends(SlotData, _super);
        /**
         * @private
         */
        function SlotData() {
            _super.call(this);
            /**
             * @private
             */
            this.actions = [];
        }
        /**
         * @private
         */
        SlotData.generateColor = function () {
            return new dragonBones.ColorTransform();
        };
        /**
         * @private
         */
        SlotData.toString = function () {
            return "[Class dragonBones.SlotData]";
        };
        /**
         * @inheritDoc
         */
        SlotData.prototype._onClear = function () {
            this.displayIndex = 0;
            this.zOrder = 0;
            this.blendMode = 0 /* Normal */;
            this.name = null;
            this.parent = null;
            this.color = null;
            if (this.actions.length) {
                for (var i = 0, l = this.actions.length; i < l; ++i) {
                    this.actions[i].returnToPool();
                }
                this.actions.length = 0;
            }
        };
        /**
         * @private
         */
        SlotData.DEFAULT_COLOR = new dragonBones.ColorTransform();
        return SlotData;
    }(dragonBones.BaseObject));
    dragonBones.SlotData = SlotData;
    /**
     * @language zh_CN
     * 皮肤数据。
     * @version DragonBones 3.0
     */
    var SkinData = (function (_super) {
        __extends(SkinData, _super);
        /**
         * @private
         */
        function SkinData() {
            _super.call(this);
            /**
             * @language zh_CN
             * 数据名称。
             * @version DragonBones 3.0
             */
            this.name = null;
            /**
             * @private
             */
            this.slots = {};
        }
        /**
         * @private
         */
        SkinData.toString = function () {
            return "[Class dragonBones.SkinData]";
        };
        /**
         * @inheritDoc
         */
        SkinData.prototype._onClear = function () {
            this.name = null;
            for (var i in this.slots) {
                this.slots[i].returnToPool();
                delete this.slots[i];
            }
        };
        /**
         * @private
         */
        SkinData.prototype.addSlot = function (value) {
            if (value && value.slot && !this.slots[value.slot.name]) {
                this.slots[value.slot.name] = value;
            }
            else {
                throw new Error();
            }
        };
        /**
         * @private
         */
        SkinData.prototype.getSlot = function (name) {
            return this.slots[name];
        };
        return SkinData;
    }(dragonBones.BaseObject));
    dragonBones.SkinData = SkinData;
    /**
     * @private
     */
    var SlotDisplayDataSet = (function (_super) {
        __extends(SlotDisplayDataSet, _super);
        function SlotDisplayDataSet() {
            _super.call(this);
            this.displays = [];
        }
        SlotDisplayDataSet.toString = function () {
            return "[Class dragonBones.SlotDisplayDataSet]";
        };
        /**
         * @inheritDoc
         */
        SlotDisplayDataSet.prototype._onClear = function () {
            this.slot = null;
            if (this.displays.length) {
                for (var i = 0, l = this.displays.length; i < l; ++i) {
                    this.displays[i].returnToPool();
                }
                this.displays.length = 0;
            }
        };
        return SlotDisplayDataSet;
    }(dragonBones.BaseObject));
    dragonBones.SlotDisplayDataSet = SlotDisplayDataSet;
    /**
     * @private
     */
    var DisplayData = (function (_super) {
        __extends(DisplayData, _super);
        function DisplayData() {
            _super.call(this);
            this.pivot = new dragonBones.Point();
            this.transform = new dragonBones.Transform();
        }
        DisplayData.toString = function () {
            return "[Class dragonBones.DisplayData]";
        };
        /**
         * @inheritDoc
         */
        DisplayData.prototype._onClear = function () {
            this.isRelativePivot = false;
            this.type = 0 /* Image */;
            this.name = null;
            this.textureData = null;
            this.armatureData = null;
            if (this.meshData) {
                this.meshData.returnToPool();
                this.meshData = null;
            }
            this.pivot.clear();
            this.transform.identity();
        };
        return DisplayData;
    }(dragonBones.BaseObject));
    dragonBones.DisplayData = DisplayData;
    /**
     * @private
     */
    var MeshData = (function (_super) {
        __extends(MeshData, _super);
        function MeshData() {
            _super.call(this);
            this.slotPose = new dragonBones.Matrix();
            this.uvs = []; // vertices * 2
            this.vertices = []; // vertices * 2
            this.vertexIndices = []; // triangles * 3
            this.boneIndices = []; // vertices bones
            this.weights = []; // vertices bones
            this.boneVertices = []; // vertices bones * 2
            this.bones = []; // bones
            this.inverseBindPose = []; // bones
        }
        MeshData.toString = function () {
            return "[Class dragonBones.MeshData]";
        };
        /**
         * @inheritDoc
         */
        MeshData.prototype._onClear = function () {
            this.skinned = false;
            this.slotPose.identity();
            if (this.uvs.length) {
                this.uvs.length = 0;
            }
            if (this.vertices.length) {
                this.vertices.length = 0;
            }
            if (this.vertexIndices.length) {
                this.vertexIndices.length = 0;
            }
            if (this.boneIndices.length) {
                this.boneIndices.length = 0;
            }
            if (this.weights.length) {
                this.weights.length = 0;
            }
            if (this.boneVertices.length) {
                this.boneVertices.length = 0;
            }
            if (this.bones.length) {
                this.bones.length = 0;
            }
            if (this.inverseBindPose.length) {
                this.inverseBindPose.length = 0;
            }
        };
        return MeshData;
    }(dragonBones.BaseObject));
    dragonBones.MeshData = MeshData;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 龙骨数据，包含多个骨架数据。
     * @see dragonBones.ArmatureData
     * @version DragonBones 3.0
     */
    var DragonBonesData = (function (_super) {
        __extends(DragonBonesData, _super);
        /**
         * @private
         */
        function DragonBonesData() {
            _super.call(this);
            /**
             * @language zh_CN
             * 所有的骨架数据。
             * @see dragonBones.ArmatureData
             * @version DragonBones 3.0
             */
            this.armatures = {};
            this._armatureNames = [];
        }
        /**
         * @private
         */
        DragonBonesData.toString = function () {
            return "[Class dragonBones.DragonBonesData]";
        };
        /**
         * @inheritDoc
         */
        DragonBonesData.prototype._onClear = function () {
            this.autoSearch = false;
            this.frameRate = 0;
            this.name = null;
            for (var i in this.armatures) {
                this.armatures[i].returnToPool();
                delete this.armatures[i];
            }
            if (this._armatureNames.length) {
                this._armatureNames.length = 0;
            }
        };
        /**
         * @language zh_CN
         * 获取指定名称的骨架。
         * @param name 骨架数据骨架名称。
         * @see dragonBones.ArmatureData
         * @version DragonBones 3.0
         */
        DragonBonesData.prototype.getArmature = function (name) {
            return this.armatures[name];
        };
        /**
         * @private
         */
        DragonBonesData.prototype.addArmature = function (value) {
            if (value && value.name && !this.armatures[value.name]) {
                this.armatures[value.name] = value;
                this._armatureNames.push(value.name);
                value.parent = this;
            }
            else {
                throw new Error();
            }
        };
        Object.defineProperty(DragonBonesData.prototype, "armatureNames", {
            /**
             * @language zh_CN
             * 所有的骨架数据名称。
             * @see #armatures
             * @version DragonBones 3.0
             */
            get: function () {
                return this._armatureNames;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#removeDragonBonesData()
         */
        DragonBonesData.prototype.dispose = function () {
            this.returnToPool();
        };
        return DragonBonesData;
    }(dragonBones.BaseObject));
    dragonBones.DragonBonesData = DragonBonesData;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    var ActionData = (function (_super) {
        __extends(ActionData, _super);
        function ActionData() {
            _super.call(this);
        }
        ActionData.toString = function () {
            return "[Class dragonBones.ActionData]";
        };
        ActionData.prototype._onClear = function () {
            this.type = 0 /* Play */;
            this.data = null;
            this.bone = null;
            this.slot = null;
        };
        return ActionData;
    }(dragonBones.BaseObject));
    dragonBones.ActionData = ActionData;
    /**
     * @private
     */
    var EventData = (function (_super) {
        __extends(EventData, _super);
        function EventData() {
            _super.call(this);
        }
        EventData.toString = function () {
            return "[Class dragonBones.EventData]";
        };
        EventData.prototype._onClear = function () {
            this.type = 0 /* Frame */;
            this.name = null;
            this.data = null;
            this.bone = null;
            this.slot = null;
        };
        return EventData;
    }(dragonBones.BaseObject));
    dragonBones.EventData = EventData;
    /**
     * @private
     */
    var FrameData = (function (_super) {
        __extends(FrameData, _super);
        function FrameData() {
            _super.call(this);
        }
        /**
         * @inheritDoc
         */
        FrameData.prototype._onClear = function () {
            this.position = 0;
            this.duration = 0;
            this.prev = null;
            this.next = null;
        };
        return FrameData;
    }(dragonBones.BaseObject));
    dragonBones.FrameData = FrameData;
    /**
     * @private
     */
    var TweenFrameData = (function (_super) {
        __extends(TweenFrameData, _super);
        function TweenFrameData() {
            _super.call(this);
        }
        TweenFrameData.samplingCurve = function (curve, frameCount) {
            if (curve.length == 0 || frameCount == 0) {
                return null;
            }
            var samplingTimes = frameCount + 2;
            var samplingStep = 1 / samplingTimes;
            var sampling = new Array((samplingTimes - 1) * 2);
            //
            curve.unshift(0, 0);
            curve.push(1, 1);
            var stepIndex = 0;
            for (var i = 0; i < samplingTimes - 1; ++i) {
                var step = samplingStep * (i + 1);
                while (curve[stepIndex + 6] < step) {
                    stepIndex += 6; // stepIndex += 3 * 2
                }
                var x1 = curve[stepIndex];
                var x4 = curve[stepIndex + 6];
                var t = (step - x1) / (x4 - x1);
                var l_t = 1 - t;
                var powA = l_t * l_t;
                var powB = t * t;
                var kA = l_t * powA;
                var kB = 3 * t * powA;
                var kC = 3 * l_t * powB;
                var kD = t * powB;
                sampling[i * 2] = kA * x1 + kB * curve[stepIndex + 2] + kC * curve[stepIndex + 4] + kD * x4;
                sampling[i * 2 + 1] = kA * curve[stepIndex + 1] + kB * curve[stepIndex + 3] + kC * curve[stepIndex + 5] + kD * curve[stepIndex + 7];
            }
            return sampling;
        };
        /**
         * @inheritDoc
         */
        TweenFrameData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.tweenEasing = 0;
            this.curve = null;
        };
        return TweenFrameData;
    }(FrameData));
    dragonBones.TweenFrameData = TweenFrameData;
    /**
     * @private
     */
    var AnimationFrameData = (function (_super) {
        __extends(AnimationFrameData, _super);
        function AnimationFrameData() {
            _super.call(this);
            this.actions = [];
            this.events = [];
        }
        AnimationFrameData.toString = function () {
            return "[Class dragonBones.AnimationFrameData]";
        };
        /**
         * @inheritDoc
         */
        AnimationFrameData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            if (this.actions.length) {
                for (var i = 0, l = this.actions.length; i < l; ++i) {
                    this.actions[i].returnToPool();
                }
                this.actions.length = 0;
            }
            if (this.events.length) {
                for (var i = 0, l = this.events.length; i < l; ++i) {
                    this.events[i].returnToPool();
                }
                this.events.length = 0;
            }
        };
        return AnimationFrameData;
    }(FrameData));
    dragonBones.AnimationFrameData = AnimationFrameData;
    /**
     * @private
     */
    var BoneFrameData = (function (_super) {
        __extends(BoneFrameData, _super);
        function BoneFrameData() {
            _super.call(this);
            this.transform = new dragonBones.Transform();
        }
        BoneFrameData.toString = function () {
            return "[Class dragonBones.BoneFrameData]";
        };
        /**
         * @inheritDoc
         */
        BoneFrameData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.tweenScale = false;
            this.tweenRotate = 0;
            this.transform.identity();
        };
        return BoneFrameData;
    }(TweenFrameData));
    dragonBones.BoneFrameData = BoneFrameData;
    /**
     * @private
     */
    var SlotFrameData = (function (_super) {
        __extends(SlotFrameData, _super);
        function SlotFrameData() {
            _super.call(this);
        }
        SlotFrameData.generateColor = function () {
            return new dragonBones.ColorTransform();
        };
        SlotFrameData.toString = function () {
            return "[Class dragonBones.SlotFrameData]";
        };
        /**
         * @inheritDoc
         */
        SlotFrameData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.displayIndex = 0;
            this.zOrder = 0;
            this.color = null;
        };
        SlotFrameData.DEFAULT_COLOR = new dragonBones.ColorTransform();
        return SlotFrameData;
    }(TweenFrameData));
    dragonBones.SlotFrameData = SlotFrameData;
    /**
     * @private
     */
    var ExtensionFrameData = (function (_super) {
        __extends(ExtensionFrameData, _super);
        function ExtensionFrameData() {
            _super.call(this);
            this.tweens = [];
            this.keys = [];
        }
        ExtensionFrameData.toString = function () {
            return "[Class dragonBones.ExtensionFrameData]";
        };
        /**
         * @inheritDoc
         */
        ExtensionFrameData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.type = 0 /* FFD */;
            if (this.tweens.length) {
                this.tweens.length = 0;
            }
            if (this.keys.length) {
                this.keys.length = 0;
            }
        };
        return ExtensionFrameData;
    }(TweenFrameData));
    dragonBones.ExtensionFrameData = ExtensionFrameData;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    var ObjectDataParser = (function (_super) {
        __extends(ObjectDataParser, _super);
        /**
         * @private
         */
        function ObjectDataParser() {
            _super.call(this);
        }
        /**
         * @private
         */
        ObjectDataParser._getBoolean = function (rawData, key, defaultValue) {
            if (key in rawData) {
                var value = rawData[key];
                var valueType = typeof value;
                if (valueType == "boolean") {
                    return value;
                }
                else if (valueType == "string") {
                    switch (value) {
                        case "0":
                        case "NaN":
                        case "":
                        case "false":
                        case "null":
                        case "undefined":
                            return false;
                        default:
                            return true;
                    }
                }
                else {
                    return Boolean(value);
                }
            }
            return defaultValue;
        };
        /**
         * @private
         */
        ObjectDataParser._getNumber = function (rawData, key, defaultValue) {
            if (key in rawData) {
                var value = rawData[key];
                if (value == null || value == "NaN") {
                    return defaultValue;
                }
                return Number(value);
            }
            return defaultValue;
        };
        /**
         * @private
         */
        ObjectDataParser._getString = function (rawData, key, defaultValue) {
            if (key in rawData) {
                return String(rawData[key]);
            }
            return defaultValue;
        };
        /**
         * @private
         */
        ObjectDataParser._getParameter = function (rawData, index, defaultValue) {
            if (rawData && rawData.length > index) {
                return rawData[index];
            }
            return defaultValue;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseArmature = function (rawData) {
            var armature = dragonBones.BaseObject.borrowObject(dragonBones.ArmatureData);
            armature.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
            armature.frameRate = ObjectDataParser._getNumber(rawData, ObjectDataParser.FRAME_RATE, this._data.frameRate) || this._data.frameRate;
            if (ObjectDataParser.TYPE in rawData && typeof rawData[ObjectDataParser.TYPE] == "string") {
                armature.type = ObjectDataParser._getArmatureType(rawData[ObjectDataParser.TYPE]);
            }
            else {
                armature.type = ObjectDataParser._getNumber(rawData, ObjectDataParser.TYPE, 0 /* Armature */);
            }
            this._armature = armature;
            this._rawBones.length = 0;
            if (ObjectDataParser.BONE in rawData) {
                var bones = rawData[ObjectDataParser.BONE];
                for (var i = 0, l = bones.length; i < l; ++i) {
                    var boneObject = bones[i];
                    var bone = this._parseBone(boneObject);
                    armature.addBone(bone, ObjectDataParser._getString(boneObject, ObjectDataParser.PARENT, null));
                    this._rawBones.push(bone);
                }
            }
            if (ObjectDataParser.IK in rawData) {
                var iks = rawData[ObjectDataParser.IK];
                for (var i = 0, l = iks.length; i < l; ++i) {
                    this._parseIK(iks[i]);
                }
            }
            if (ObjectDataParser.SLOT in rawData) {
                var slots = rawData[ObjectDataParser.SLOT];
                for (var i = 0, l = slots.length; i < l; ++i) {
                    armature.addSlot(this._parseSlot(slots[i]));
                }
            }
            if (ObjectDataParser.SKIN in rawData) {
                var skins = rawData[ObjectDataParser.SKIN];
                for (var i = 0, l = skins.length; i < l; ++i) {
                    armature.addSkin(this._parseSkin(skins[i]));
                }
            }
            if (ObjectDataParser.ANIMATION in rawData) {
                var animations = rawData[ObjectDataParser.ANIMATION];
                for (var i = 0, l = animations.length; i < l; ++i) {
                    armature.addAnimation(this._parseAnimation(animations[i]));
                }
            }
            if ((ObjectDataParser.ACTION in rawData) ||
                (ObjectDataParser.ACTIONS in rawData) ||
                (ObjectDataParser.DEFAULT_ACTIONS in rawData)) {
                this._parseActionData(rawData, armature.actions, null, null);
            }
            if (this._isParentCooriinate && ObjectDataParser._getBoolean(rawData, ObjectDataParser.IS_GLOBAL, true)) {
                this._globalToLocal(armature);
            }
            this._armature = null;
            this._rawBones.length = 0;
            return armature;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseBone = function (rawData) {
            var bone = dragonBones.BaseObject.borrowObject(dragonBones.BoneData);
            bone.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
            bone.inheritTranslation = ObjectDataParser._getBoolean(rawData, ObjectDataParser.INHERIT_TRANSLATION, true);
            bone.inheritRotation = ObjectDataParser._getBoolean(rawData, ObjectDataParser.INHERIT_ROTATION, true);
            bone.inheritScale = ObjectDataParser._getBoolean(rawData, ObjectDataParser.INHERIT_SCALE, true);
            bone.length = ObjectDataParser._getNumber(rawData, ObjectDataParser.LENGTH, 0) * this._armatureScale;
            if (ObjectDataParser.TRANSFORM in rawData) {
                this._parseTransform(rawData[ObjectDataParser.TRANSFORM], bone.transform);
            }
            if (this._isParentCooriinate) {
                bone.inheritRotation = true;
                bone.inheritScale = false;
            }
            return bone;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseIK = function (rawData) {
            var bone = this._armature.getBone(ObjectDataParser._getString(rawData, (ObjectDataParser.BONE in rawData) ? ObjectDataParser.BONE : ObjectDataParser.NAME, null));
            if (bone) {
                bone.ik = this._armature.getBone(ObjectDataParser._getString(rawData, ObjectDataParser.TARGET, null));
                bone.bendPositive = ObjectDataParser._getBoolean(rawData, ObjectDataParser.BEND_POSITIVE, true);
                bone.chain = ObjectDataParser._getNumber(rawData, ObjectDataParser.CHAIN, 0);
                bone.weight = ObjectDataParser._getNumber(rawData, ObjectDataParser.WEIGHT, 1);
                if (bone.chain > 0 && bone.parent && !bone.parent.ik) {
                    bone.parent.ik = bone.ik;
                    bone.parent.chainIndex = 0;
                    bone.parent.chain = 0;
                    bone.chainIndex = 1;
                }
                else {
                    bone.chain = 0;
                    bone.chainIndex = 0;
                }
            }
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseSlot = function (rawData) {
            var slot = dragonBones.BaseObject.borrowObject(dragonBones.SlotData);
            slot.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
            slot.parent = this._armature.getBone(ObjectDataParser._getString(rawData, ObjectDataParser.PARENT, null));
            slot.displayIndex = ObjectDataParser._getNumber(rawData, ObjectDataParser.DISPLAY_INDEX, 0);
            slot.zOrder = ObjectDataParser._getNumber(rawData, ObjectDataParser.Z_ORDER, this._armature.sortedSlots.length); // TODO zOrder.
            if (ObjectDataParser.COLOR in rawData) {
                slot.color = dragonBones.SlotData.generateColor();
                this._parseColorTransform(rawData[ObjectDataParser.COLOR], slot.color);
            }
            else {
                slot.color = dragonBones.SlotData.DEFAULT_COLOR;
            }
            if (ObjectDataParser.BLEND_MODE in rawData && typeof rawData[ObjectDataParser.BLEND_MODE] == "string") {
                slot.blendMode = ObjectDataParser._getBlendMode(rawData[ObjectDataParser.BLEND_MODE]);
            }
            else {
                slot.blendMode = ObjectDataParser._getNumber(rawData, ObjectDataParser.BLEND_MODE, 0 /* Normal */);
            }
            if ((ObjectDataParser.ACTION in rawData) ||
                (ObjectDataParser.ACTIONS in rawData) ||
                (ObjectDataParser.DEFAULT_ACTIONS in rawData)) {
                this._parseActionData(rawData, slot.actions, null, null);
            }
            if (this._isParentCooriinate) {
                if (ObjectDataParser.COLOR_TRANSFORM in rawData) {
                    slot.color = dragonBones.SlotData.generateColor();
                    this._parseColorTransform(rawData[ObjectDataParser.COLOR_TRANSFORM], slot.color);
                }
                else {
                    slot.color = dragonBones.SlotData.DEFAULT_COLOR;
                }
            }
            return slot;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseSkin = function (rawData) {
            var skin = dragonBones.BaseObject.borrowObject(dragonBones.SkinData);
            skin.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, "__default") || "__default";
            if (ObjectDataParser.SLOT in rawData) {
                this._skin = skin;
                var slots = rawData[ObjectDataParser.SLOT];
                for (var i = 0, l = slots.length; i < l; ++i) {
                    if (this._isParentCooriinate) {
                        this._armature.addSlot(this._parseSlot(slots[i]));
                    }
                    skin.addSlot(this._parseSlotDisplaySet(slots[i]));
                }
                this._skin = null;
            }
            return skin;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseSlotDisplaySet = function (rawData) {
            var slotDisplayDataSet = dragonBones.BaseObject.borrowObject(dragonBones.SlotDisplayDataSet);
            slotDisplayDataSet.slot = this._armature.getSlot(ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null));
            if (ObjectDataParser.DISPLAY in rawData) {
                var displayObjectSet = rawData[ObjectDataParser.DISPLAY];
                var displayDataSet = slotDisplayDataSet.displays;
                this._slotDisplayDataSet = slotDisplayDataSet;
                for (var i = 0, l = displayObjectSet.length; i < l; ++i) {
                    displayDataSet.push(this._parseDisplay(displayObjectSet[i]));
                }
                this._slotDisplayDataSet = null;
            }
            return slotDisplayDataSet;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseDisplay = function (rawData) {
            var display = dragonBones.BaseObject.borrowObject(dragonBones.DisplayData);
            display.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
            if (ObjectDataParser.TYPE in rawData && typeof rawData[ObjectDataParser.TYPE] == "string") {
                display.type = ObjectDataParser._getDisplayType(rawData[ObjectDataParser.TYPE]);
            }
            else {
                display.type = ObjectDataParser._getNumber(rawData, ObjectDataParser.TYPE, 0 /* Image */);
            }
            display.isRelativePivot = true;
            if (ObjectDataParser.PIVOT in rawData) {
                var pivotObject = rawData[ObjectDataParser.PIVOT];
                display.pivot.x = ObjectDataParser._getNumber(pivotObject, ObjectDataParser.X, 0);
                display.pivot.y = ObjectDataParser._getNumber(pivotObject, ObjectDataParser.Y, 0);
            }
            else if (this._isParentCooriinate) {
                var transformObject = rawData[ObjectDataParser.TRANSFORM];
                display.isRelativePivot = false;
                display.pivot.x = ObjectDataParser._getNumber(transformObject, ObjectDataParser.PIVOT_X, 0) * this._armatureScale;
                display.pivot.y = ObjectDataParser._getNumber(transformObject, ObjectDataParser.PIVOT_Y, 0) * this._armatureScale;
            }
            else {
                display.pivot.x = 0.5;
                display.pivot.y = 0.5;
            }
            if (ObjectDataParser.TRANSFORM in rawData) {
                this._parseTransform(rawData[ObjectDataParser.TRANSFORM], display.transform);
            }
            switch (display.type) {
                case 0 /* Image */:
                    break;
                case 1 /* Armature */:
                    break;
                case 2 /* Mesh */:
                    display.meshData = this._parseMesh(rawData);
                    break;
            }
            return display;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseMesh = function (rawData) {
            var mesh = dragonBones.BaseObject.borrowObject(dragonBones.MeshData);
            var rawVertices = rawData[ObjectDataParser.VERTICES];
            var rawUVs = rawData[ObjectDataParser.UVS];
            var rawTriangles = rawData[ObjectDataParser.TRIANGLES];
            var numVertices = Math.floor(rawVertices.length / 2); // uint()
            var numTriangles = Math.floor(rawTriangles.length / 3); // uint()
            var inverseBindPose = new Array(this._armature.sortedBones.length);
            mesh.skinned = (ObjectDataParser.WEIGHTS in rawData) && rawData[ObjectDataParser.WEIGHTS].length > 0;
            mesh.uvs.length = numVertices * 2;
            mesh.vertices.length = numVertices * 2;
            mesh.vertexIndices.length = numTriangles * 3;
            if (mesh.skinned) {
                mesh.boneIndices.length = numVertices;
                mesh.weights.length = numVertices;
                mesh.boneVertices.length = numVertices;
                if (ObjectDataParser.SLOT_POSE in rawData) {
                    var rawSlotPose = rawData[ObjectDataParser.SLOT_POSE];
                    mesh.slotPose.a = rawSlotPose[0];
                    mesh.slotPose.b = rawSlotPose[1];
                    mesh.slotPose.c = rawSlotPose[2];
                    mesh.slotPose.d = rawSlotPose[3];
                    mesh.slotPose.tx = rawSlotPose[4];
                    mesh.slotPose.ty = rawSlotPose[5];
                }
                if (ObjectDataParser.BONE_POSE in rawData) {
                    var rawBonePose = rawData[ObjectDataParser.BONE_POSE];
                    for (var i = 0, l = rawBonePose.length; i < l; i += 7) {
                        var rawBoneIndex = rawBonePose[i];
                        var boneMatrix = inverseBindPose[rawBoneIndex] = new dragonBones.Matrix();
                        boneMatrix.a = rawBonePose[i + 1];
                        boneMatrix.b = rawBonePose[i + 2];
                        boneMatrix.c = rawBonePose[i + 3];
                        boneMatrix.d = rawBonePose[i + 4];
                        boneMatrix.tx = rawBonePose[i + 5];
                        boneMatrix.ty = rawBonePose[i + 6];
                        boneMatrix.invert();
                    }
                }
            }
            for (var i = 0, iW = 0, l = rawVertices.length; i < l; i += 2) {
                var iN = i + 1;
                var vertexIndex = i / 2;
                var x = mesh.vertices[i] = rawVertices[i] * this._armatureScale;
                var y = mesh.vertices[iN] = rawVertices[iN] * this._armatureScale;
                mesh.uvs[i] = rawUVs[i];
                mesh.uvs[iN] = rawUVs[iN];
                if (mesh.skinned) {
                    var rawWeights = rawData[ObjectDataParser.WEIGHTS];
                    var numBones = rawWeights[iW];
                    var indices = mesh.boneIndices[vertexIndex] = new Array(numBones);
                    var weights = mesh.weights[vertexIndex] = new Array(numBones);
                    var boneVertices = mesh.boneVertices[vertexIndex] = new Array(numBones * 2);
                    mesh.slotPose.transformPoint(x, y, this._helpPoint);
                    x = mesh.vertices[i] = this._helpPoint.x;
                    y = mesh.vertices[iN] = this._helpPoint.y;
                    for (var iB = 0; iB < numBones; ++iB) {
                        var iI = iW + 1 + iB * 2;
                        var rawBoneIndex = rawWeights[iI];
                        var boneData = this._rawBones[rawBoneIndex];
                        var boneIndex = mesh.bones.indexOf(boneData);
                        if (boneIndex < 0) {
                            boneIndex = mesh.bones.length;
                            mesh.bones[boneIndex] = boneData;
                            mesh.inverseBindPose[boneIndex] = inverseBindPose[rawBoneIndex];
                        }
                        mesh.inverseBindPose[boneIndex].transformPoint(x, y, this._helpPoint);
                        indices[iB] = boneIndex;
                        weights[iB] = rawWeights[iI + 1];
                        boneVertices[iB * 2] = this._helpPoint.x;
                        boneVertices[iB * 2 + 1] = this._helpPoint.y;
                    }
                    iW += numBones * 2 + 1;
                }
            }
            for (var i = 0, l = rawTriangles.length; i < l; ++i) {
                mesh.vertexIndices[i] = rawTriangles[i];
            }
            return mesh;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseAnimation = function (rawData) {
            var animation = dragonBones.BaseObject.borrowObject(dragonBones.AnimationData);
            animation.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, "__default") || "__default";
            animation.frameCount = Math.max(ObjectDataParser._getNumber(rawData, ObjectDataParser.DURATION, 1), 1);
            animation.position = ObjectDataParser._getNumber(rawData, ObjectDataParser.POSITION, 0) / this._armature.frameRate;
            animation.duration = animation.frameCount / this._armature.frameRate;
            animation.playTimes = ObjectDataParser._getNumber(rawData, ObjectDataParser.PLAY_TIMES, 1);
            animation.fadeInTime = ObjectDataParser._getNumber(rawData, ObjectDataParser.FADE_IN_TIME, 0);
            this._animation = animation;
            var animationName = ObjectDataParser._getString(rawData, ObjectDataParser.ANIMATION, null);
            if (animationName) {
                animation.animation = this._armature.getAnimation(animationName);
                if (!animation.animation) {
                }
                return animation;
            }
            this._parseTimeline(rawData, animation, this._parseAnimationFrame);
            if (ObjectDataParser.BONE in rawData) {
                var boneTimelines = rawData[ObjectDataParser.BONE];
                for (var i = 0, l = boneTimelines.length; i < l; ++i) {
                    animation.addBoneTimeline(this._parseBoneTimeline(boneTimelines[i]));
                }
            }
            if (ObjectDataParser.SLOT in rawData) {
                var slotTimelines = rawData[ObjectDataParser.SLOT];
                for (var i = 0, l = slotTimelines.length; i < l; ++i) {
                    animation.addSlotTimeline(this._parseSlotTimeline(slotTimelines[i]));
                }
            }
            if (ObjectDataParser.FFD in rawData) {
                var ffdTimelines = rawData[ObjectDataParser.FFD];
                for (var i = 0, l = ffdTimelines.length; i < l; ++i) {
                    animation.addFFDTimeline(this._parseFFDTimeline(ffdTimelines[i]));
                }
            }
            if (this._isParentCooriinate) {
                this._isAutoTween = ObjectDataParser._getBoolean(rawData, ObjectDataParser.AUTO_TWEEN, true);
                this._animationTweenEasing = ObjectDataParser._getNumber(rawData, ObjectDataParser.TWEEN_EASING, 0) || 0;
                animation.playTimes = ObjectDataParser._getNumber(rawData, ObjectDataParser.LOOP, 1);
                if (ObjectDataParser.TIMELINE in rawData) {
                    var timelines = rawData[ObjectDataParser.TIMELINE];
                    for (var i = 0, l = timelines.length; i < l; ++i) {
                        animation.addBoneTimeline(this._parseBoneTimeline(timelines[i]));
                    }
                    for (var i = 0, l = timelines.length; i < l; ++i) {
                        animation.addSlotTimeline(this._parseSlotTimeline(timelines[i]));
                    }
                }
            }
            else {
                this._isAutoTween = false;
                this._animationTweenEasing = 0;
            }
            for (var i in this._armature.bones) {
                var bone = this._armature.bones[i];
                if (!animation.getBoneTimeline(bone.name)) {
                    var boneTimeline = dragonBones.BaseObject.borrowObject(dragonBones.BoneTimelineData);
                    var boneFrame = dragonBones.BaseObject.borrowObject(dragonBones.BoneFrameData);
                    boneTimeline.bone = bone;
                    boneTimeline.frames[0] = boneFrame;
                    animation.addBoneTimeline(boneTimeline);
                }
            }
            for (var i in this._armature.slots) {
                var slot = this._armature.slots[i];
                if (!animation.getSlotTimeline(slot.name)) {
                    var slotTimeline = dragonBones.BaseObject.borrowObject(dragonBones.SlotTimelineData);
                    var slotFrame = dragonBones.BaseObject.borrowObject(dragonBones.SlotFrameData);
                    slotTimeline.slot = slot;
                    slotFrame.displayIndex = slot.displayIndex;
                    //slotFrame.zOrder = -2; // TODO zOrder.
                    if (slot.color == dragonBones.SlotData.DEFAULT_COLOR) {
                        slotFrame.color = dragonBones.SlotFrameData.DEFAULT_COLOR;
                    }
                    else {
                        slotFrame.color = dragonBones.SlotFrameData.generateColor();
                        slotFrame.color.copyFrom(slot.color);
                    }
                    slotTimeline.frames[0] = slotFrame;
                    animation.addSlotTimeline(slotTimeline);
                    if (this._isParentCooriinate) {
                        slotFrame.displayIndex = -1;
                    }
                }
            }
            this._animation = null;
            return animation;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseBoneTimeline = function (rawData) {
            var timeline = dragonBones.BaseObject.borrowObject(dragonBones.BoneTimelineData);
            timeline.bone = this._armature.getBone(ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null));
            this._parseTimeline(rawData, timeline, this._parseBoneFrame);
            var originTransform = timeline.originTransform;
            var prevFrame = null;
            for (var i = 0, l = timeline.frames.length; i < l; ++i) {
                var frame = timeline.frames[i];
                if (!prevFrame) {
                    originTransform.copyFrom(frame.transform);
                    frame.transform.identity();
                    if (originTransform.scaleX == 0) {
                        originTransform.scaleX = 0.001;
                    }
                    if (originTransform.scaleY == 0) {
                        originTransform.scaleY = 0.001;
                    }
                }
                else if (prevFrame != frame) {
                    frame.transform.minus(originTransform);
                }
                prevFrame = frame;
            }
            if (timeline.scale != 1 || timeline.offset != 0) {
                this._animation.hasAsynchronyTimeline = true;
            }
            return timeline;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseSlotTimeline = function (rawData) {
            var timeline = dragonBones.BaseObject.borrowObject(dragonBones.SlotTimelineData);
            timeline.slot = this._armature.getSlot(ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null));
            this._parseTimeline(rawData, timeline, this._parseSlotFrame);
            if (timeline.scale != 1 || timeline.offset != 0) {
                this._animation.hasAsynchronyTimeline = true;
            }
            return timeline;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseFFDTimeline = function (rawData) {
            var timeline = dragonBones.BaseObject.borrowObject(dragonBones.FFDTimelineData);
            timeline.skin = this._armature.getSkin(ObjectDataParser._getString(rawData, ObjectDataParser.SKIN, null));
            timeline.slot = timeline.skin.getSlot(ObjectDataParser._getString(rawData, ObjectDataParser.SLOT, null)); // NAME;
            var meshName = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
            for (var i = 0, l = timeline.slot.displays.length; i < l; ++i) {
                var displayData = timeline.slot.displays[i];
                if (displayData.meshData && displayData.name == meshName) {
                    timeline.displayIndex = i; // rawData[DISPLAY_INDEX];
                    this._mesh = displayData.meshData; // Find the ffd's mesh.
                    break;
                }
            }
            this._parseTimeline(rawData, timeline, this._parseFFDFrame);
            this._mesh = null;
            return timeline;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseAnimationFrame = function (rawData, frameStart, frameCount) {
            var frame = dragonBones.BaseObject.borrowObject(dragonBones.AnimationFrameData);
            this._parseFrame(rawData, frame, frameStart, frameCount);
            if ((ObjectDataParser.ACTION in rawData) ||
                (ObjectDataParser.ACTIONS in rawData) ||
                (ObjectDataParser.DEFAULT_ACTIONS in rawData)) {
                this._parseActionData(rawData, frame.actions, null, null);
            }
            if ((ObjectDataParser.EVENT in rawData) || (ObjectDataParser.SOUND in rawData)) {
                this._parseEventData(rawData, frame.events, null, null);
            }
            return frame;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseBoneFrame = function (rawData, frameStart, frameCount) {
            var frame = dragonBones.BaseObject.borrowObject(dragonBones.BoneFrameData);
            frame.tweenRotate = ObjectDataParser._getNumber(rawData, ObjectDataParser.TWEEN_ROTATE, 0);
            frame.tweenScale = ObjectDataParser._getBoolean(rawData, ObjectDataParser.TWEEN_SCALE, true);
            this._parseTweenFrame(rawData, frame, frameStart, frameCount);
            if (ObjectDataParser.TRANSFORM in rawData) {
                var transformObject = rawData[ObjectDataParser.TRANSFORM];
                this._parseTransform(transformObject, frame.transform);
                if (this._isParentCooriinate) {
                    this._helpPoint.x = ObjectDataParser._getNumber(transformObject, ObjectDataParser.PIVOT_X, 0);
                    this._helpPoint.y = ObjectDataParser._getNumber(transformObject, ObjectDataParser.PIVOT_Y, 0);
                    frame.transform.toMatrix(this._helpMatrix);
                    this._helpMatrix.transformPoint(this._helpPoint.x, this._helpPoint.y, this._helpPoint, true);
                    frame.transform.x += this._helpPoint.x;
                    frame.transform.y += this._helpPoint.y;
                }
            }
            var bone = this._timeline.bone;
            if ((ObjectDataParser.ACTION in rawData) ||
                (ObjectDataParser.ACTIONS in rawData) ||
                (ObjectDataParser.DEFAULT_ACTIONS in rawData)) {
                var slot = this._armature.getSlot(bone.name);
                var actions = [];
                this._parseActionData(rawData, actions, bone, slot);
                this._mergeFrameToAnimationTimeline(frame, actions, null); // Merge actions and events to animation timeline.
            }
            if ((ObjectDataParser.EVENT in rawData) || (ObjectDataParser.SOUND in rawData)) {
                var events = [];
                this._parseEventData(rawData, events, bone, null);
                this._mergeFrameToAnimationTimeline(frame, null, events); // Merge actions and events to animation timeline.
            }
            return frame;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseSlotFrame = function (rawData, frameStart, frameCount) {
            var frame = dragonBones.BaseObject.borrowObject(dragonBones.SlotFrameData);
            frame.displayIndex = ObjectDataParser._getNumber(rawData, ObjectDataParser.DISPLAY_INDEX, 0);
            //frame.zOrder = _getNumber(rawData, Z_ORDER, -1); // TODO zorder
            this._parseTweenFrame(rawData, frame, frameStart, frameCount);
            if (ObjectDataParser.COLOR in rawData || ObjectDataParser.COLOR_TRANSFORM in rawData) {
                frame.color = dragonBones.SlotFrameData.generateColor();
                this._parseColorTransform(rawData[ObjectDataParser.COLOR] || rawData[ObjectDataParser.COLOR_TRANSFORM], frame.color);
            }
            else {
                frame.color = dragonBones.SlotFrameData.DEFAULT_COLOR;
            }
            if (this._isParentCooriinate) {
                if (ObjectDataParser._getBoolean(rawData, ObjectDataParser.HIDE, false)) {
                    frame.displayIndex = -1;
                }
            }
            else if (ObjectDataParser.ACTION in rawData) {
                var slot = this._timeline.slot;
                var actions = [];
                this._parseActionData(rawData, actions, slot.parent, slot);
                this._mergeFrameToAnimationTimeline(frame, actions, null); // Merge actions and events to animation timeline.
            }
            return frame;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseFFDFrame = function (rawData, frameStart, frameCount) {
            var frame = dragonBones.BaseObject.borrowObject(dragonBones.ExtensionFrameData);
            frame.type = ObjectDataParser._getNumber(rawData, ObjectDataParser.TYPE, 0 /* FFD */);
            this._parseTweenFrame(rawData, frame, frameStart, frameCount);
            var rawVertices = rawData[ObjectDataParser.VERTICES];
            var offset = ObjectDataParser._getNumber(rawData, ObjectDataParser.OFFSET, 0);
            var x = 0;
            var y = 0;
            for (var i = 0, l = this._mesh.vertices.length; i < l; i += 2) {
                if (!rawVertices || i < offset || i - offset >= rawVertices.length) {
                    x = 0;
                    y = 0;
                }
                else {
                    x = rawVertices[i - offset] * this._armatureScale;
                    y = rawVertices[i + 1 - offset] * this._armatureScale;
                }
                if (this._mesh.skinned) {
                    this._mesh.slotPose.transformPoint(x, y, this._helpPoint, true);
                    x = this._helpPoint.x;
                    y = this._helpPoint.y;
                    var boneIndices = this._mesh.boneIndices[i / 2];
                    for (var iB = 0, lB = boneIndices.length; iB < lB; ++iB) {
                        var boneIndex = boneIndices[iB];
                        this._mesh.inverseBindPose[boneIndex].transformPoint(x, y, this._helpPoint, true);
                        frame.tweens.push(this._helpPoint.x, this._helpPoint.y);
                    }
                }
                else {
                    frame.tweens.push(x, y);
                }
            }
            return frame;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseTweenFrame = function (rawData, frame, frameStart, frameCount) {
            this._parseFrame(rawData, frame, frameStart, frameCount);
            if (ObjectDataParser.TWEEN_EASING in rawData) {
                frame.tweenEasing = ObjectDataParser._getNumber(rawData, ObjectDataParser.TWEEN_EASING, dragonBones.DragonBones.NO_TWEEN);
            }
            else if (this._isParentCooriinate) {
                frame.tweenEasing = this._isAutoTween ? this._animationTweenEasing : dragonBones.DragonBones.NO_TWEEN;
            }
            if (this._isParentCooriinate && this._animation.scale == 1 && this._timeline.scale == 1 && frame.duration * this._armature.frameRate < 2) {
                frame.tweenEasing = dragonBones.DragonBones.NO_TWEEN;
            }
            if (ObjectDataParser.CURVE in rawData) {
                frame.curve = dragonBones.TweenFrameData.samplingCurve(rawData[ObjectDataParser.CURVE], frameCount);
            }
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseFrame = function (rawData, frame, frameStart, frameCount) {
            frame.position = frameStart / this._armature.frameRate;
            frame.duration = frameCount / this._armature.frameRate;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseTimeline = function (rawData, timeline, frameParser) {
            timeline.scale = ObjectDataParser._getNumber(rawData, ObjectDataParser.SCALE, 1);
            timeline.offset = ObjectDataParser._getNumber(rawData, ObjectDataParser.OFFSET, 0);
            this._timeline = timeline;
            if (ObjectDataParser.FRAME in rawData) {
                var rawFrames = rawData[ObjectDataParser.FRAME];
                if (rawFrames.length) {
                    if (rawFrames.length == 1) {
                        timeline.frames.length = 1;
                        timeline.frames[0] = frameParser.call(this, rawFrames[0], 0, ObjectDataParser._getNumber(rawFrames[0], ObjectDataParser.DURATION, 1));
                    }
                    else {
                        timeline.frames.length = this._animation.frameCount + 1;
                        var frameStart = 0;
                        var frameCount = 0;
                        var frame = null;
                        var prevFrame = null;
                        for (var i = 0, iW = 0, l = this._animation.frameCount + 1; i < l; ++i) {
                            if (frameStart + frameCount <= i && iW < rawFrames.length) {
                                var frameObject = rawFrames[iW++];
                                frameStart = i;
                                frameCount = ObjectDataParser._getNumber(frameObject, ObjectDataParser.DURATION, 1);
                                frame = frameParser.call(this, frameObject, frameStart, frameCount);
                                if (prevFrame) {
                                    prevFrame.next = frame;
                                    frame.prev = prevFrame;
                                    if (this._isParentCooriinate) {
                                        if (prevFrame instanceof dragonBones.TweenFrameData && frameObject[ObjectDataParser.DISPLAY_INDEX] == -1) {
                                            prevFrame.tweenEasing = dragonBones.DragonBones.NO_TWEEN;
                                        }
                                    }
                                }
                                prevFrame = frame;
                            }
                            timeline.frames[i] = frame;
                        }
                        frame.duration = this._animation.duration - frame.position; // Modify last frame duration.
                        frame = timeline.frames[0];
                        prevFrame.next = frame;
                        frame.prev = prevFrame;
                        if (this._isParentCooriinate) {
                            if (prevFrame instanceof dragonBones.TweenFrameData && rawFrames[0][ObjectDataParser.DISPLAY_INDEX] == -1) {
                                prevFrame.tweenEasing = dragonBones.DragonBones.NO_TWEEN;
                            }
                        }
                    }
                }
            }
            this._timeline = null;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseActionData = function (rawData, actions, bone, slot) {
            var actionsObject = rawData[ObjectDataParser.ACTION] || rawData[ObjectDataParser.ACTIONS] || rawData[ObjectDataParser.DEFAULT_ACTIONS];
            if (typeof actionsObject == "string") {
                var actionData = dragonBones.BaseObject.borrowObject(dragonBones.ActionData);
                actionData.type = 4 /* FadeIn */;
                actionData.data = [actionsObject, -1, -1];
                actionData.bone = bone;
                actionData.slot = slot;
                actions.push(actionData);
            }
            else if (actionsObject instanceof Array) {
                for (var i = 0, l = actionsObject.length; i < l; ++i) {
                    var actionObject = (actionsObject[i] instanceof Array ? actionsObject[i] : null);
                    var actionData = dragonBones.BaseObject.borrowObject(dragonBones.ActionData);
                    var animationName = actionObject ? null : actionsObject[i]["gotoAndPlay"];
                    if (actionObject) {
                        var actionType = actionObject[0];
                        if (typeof actionType == "string") {
                            actionData.type = ObjectDataParser._getActionType(actionType);
                        }
                        else {
                            actionData.type = ObjectDataParser._getParameter(actionObject, 0, 4 /* FadeIn */);
                        }
                    }
                    else {
                        actionData.type = 2 /* GotoAndPlay */;
                    }
                    switch (actionData.type) {
                        case 0 /* Play */:
                            actionData.data = [
                                actionObject ? ObjectDataParser._getParameter(actionObject, 1, null) : animationName,
                                ObjectDataParser._getParameter(actionObject, 2, -1),
                            ];
                            break;
                        case 1 /* Stop */:
                            actionData.data = [
                                actionObject ? ObjectDataParser._getParameter(actionObject, 1, null) : animationName,
                            ];
                            break;
                        case 2 /* GotoAndPlay */:
                            actionData.data = [
                                actionObject ? ObjectDataParser._getParameter(actionObject, 1, null) : animationName,
                                ObjectDataParser._getParameter(actionObject, 2, 0),
                                ObjectDataParser._getParameter(actionObject, 3, -1) // playTimes
                            ];
                            break;
                        case 3 /* GotoAndStop */:
                            actionData.data = [
                                actionObject ? ObjectDataParser._getParameter(actionObject, 1, null) : animationName,
                                ObjectDataParser._getParameter(actionObject, 2, 0),
                            ];
                            break;
                        case 4 /* FadeIn */:
                            actionData.data = [
                                actionObject ? ObjectDataParser._getParameter(actionObject, 1, null) : animationName,
                                ObjectDataParser._getParameter(actionObject, 2, -1),
                                ObjectDataParser._getParameter(actionObject, 3, -1) // playTimes
                            ];
                            break;
                        case 5 /* FadeOut */:
                            actionData.data = [
                                actionObject ? ObjectDataParser._getParameter(actionObject, 1, null) : animationName,
                                ObjectDataParser._getParameter(actionObject, 2, 0) // fadeOutTime
                            ];
                            break;
                    }
                    actionData.bone = bone;
                    actionData.slot = slot;
                    actions.push(actionData);
                }
            }
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseEventData = function (rawData, events, bone, slot) {
            if (ObjectDataParser.SOUND in rawData) {
                var soundEventData = dragonBones.BaseObject.borrowObject(dragonBones.EventData);
                soundEventData.type = 1 /* Sound */;
                soundEventData.name = rawData[ObjectDataParser.SOUND];
                soundEventData.bone = bone;
                soundEventData.slot = slot;
                events.push(soundEventData);
            }
            if (ObjectDataParser.EVENT in rawData) {
                var eventData = dragonBones.BaseObject.borrowObject(dragonBones.EventData);
                eventData.type = 0 /* Frame */;
                eventData.name = rawData[ObjectDataParser.EVENT];
                eventData.bone = bone;
                eventData.slot = slot;
                if (ObjectDataParser.DATA in rawData) {
                    eventData.data = rawData[ObjectDataParser.DATA];
                }
                events.push(eventData);
            }
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseTransform = function (rawData, transform) {
            transform.x = ObjectDataParser._getNumber(rawData, ObjectDataParser.X, 0) * this._armatureScale;
            transform.y = ObjectDataParser._getNumber(rawData, ObjectDataParser.Y, 0) * this._armatureScale;
            transform.skewX = ObjectDataParser._getNumber(rawData, ObjectDataParser.SKEW_X, 0) * dragonBones.DragonBones.ANGLE_TO_RADIAN;
            transform.skewY = ObjectDataParser._getNumber(rawData, ObjectDataParser.SKEW_Y, 0) * dragonBones.DragonBones.ANGLE_TO_RADIAN;
            transform.scaleX = ObjectDataParser._getNumber(rawData, ObjectDataParser.SCALE_X, 1);
            transform.scaleY = ObjectDataParser._getNumber(rawData, ObjectDataParser.SCALE_Y, 1);
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseColorTransform = function (rawData, color) {
            color.alphaMultiplier = ObjectDataParser._getNumber(rawData, ObjectDataParser.ALPHA_MULTIPLIER, 100) * 0.01;
            color.redMultiplier = ObjectDataParser._getNumber(rawData, ObjectDataParser.RED_MULTIPLIER, 100) * 0.01;
            color.greenMultiplier = ObjectDataParser._getNumber(rawData, ObjectDataParser.GREEN_MULTIPLIER, 100) * 0.01;
            color.blueMultiplier = ObjectDataParser._getNumber(rawData, ObjectDataParser.BLUE_MULTIPLIER, 100) * 0.01;
            color.alphaOffset = ObjectDataParser._getNumber(rawData, ObjectDataParser.ALPHA_OFFSET, 0);
            color.redOffset = ObjectDataParser._getNumber(rawData, ObjectDataParser.RED_OFFSET, 0);
            color.greenOffset = ObjectDataParser._getNumber(rawData, ObjectDataParser.GREEN_OFFSET, 0);
            color.blueOffset = ObjectDataParser._getNumber(rawData, ObjectDataParser.BLUE_OFFSET, 0);
        };
        /**
         * @inheritDoc
         */
        ObjectDataParser.prototype.parseDragonBonesData = function (rawData, scale) {
            if (scale === void 0) { scale = 1; }
            if (rawData) {
                var version = ObjectDataParser._getString(rawData, ObjectDataParser.VERSION, null);
                this._isParentCooriinate = version == ObjectDataParser.DATA_VERSION_2_3 || version == ObjectDataParser.DATA_VERSION_3_0;
                this._armatureScale = scale;
                if (version == ObjectDataParser.DATA_VERSION ||
                    version == ObjectDataParser.DATA_VERSION_4_0 ||
                    this._isParentCooriinate) {
                    var data = dragonBones.BaseObject.borrowObject(dragonBones.DragonBonesData);
                    data.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
                    data.frameRate = ObjectDataParser._getNumber(rawData, ObjectDataParser.FRAME_RATE, 24) || 24;
                    if (ObjectDataParser.ARMATURE in rawData) {
                        this._data = data;
                        var armatures = rawData[ObjectDataParser.ARMATURE];
                        for (var i = 0, l = armatures.length; i < l; ++i) {
                            data.addArmature(this._parseArmature(armatures[i]));
                        }
                        this._data = null;
                    }
                    return data;
                }
                else {
                    throw new Error("Nonsupport data version.");
                }
            }
            else {
                throw new Error();
            }
            // return null;
        };
        /**
         * @inheritDoc
         */
        ObjectDataParser.prototype.parseTextureAtlasData = function (rawData, textureAtlasData, scale) {
            if (scale === void 0) { scale = 0; }
            if (rawData) {
                textureAtlasData.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
                textureAtlasData.imagePath = ObjectDataParser._getString(rawData, ObjectDataParser.IMAGE_PATH, null);
                // Texture format.
                if (scale > 0) {
                    textureAtlasData.scale = scale;
                }
                else {
                    scale = textureAtlasData.scale = ObjectDataParser._getNumber(rawData, ObjectDataParser.SCALE, textureAtlasData.scale);
                }
                scale = 1 / scale;
                if (ObjectDataParser.SUB_TEXTURE in rawData) {
                    var textures = rawData[ObjectDataParser.SUB_TEXTURE];
                    for (var i = 0, l = textures.length; i < l; ++i) {
                        var textureObject = textures[i];
                        var textureData = textureAtlasData.generateTextureData();
                        textureData.name = ObjectDataParser._getString(textureObject, ObjectDataParser.NAME, null);
                        textureData.rotated = ObjectDataParser._getBoolean(textureObject, ObjectDataParser.ROTATED, false);
                        textureData.region.x = ObjectDataParser._getNumber(textureObject, ObjectDataParser.X, 0) * scale;
                        textureData.region.y = ObjectDataParser._getNumber(textureObject, ObjectDataParser.Y, 0) * scale;
                        textureData.region.width = ObjectDataParser._getNumber(textureObject, ObjectDataParser.WIDTH, 0) * scale;
                        textureData.region.height = ObjectDataParser._getNumber(textureObject, ObjectDataParser.HEIGHT, 0) * scale;
                        var frameWidth = ObjectDataParser._getNumber(textureObject, ObjectDataParser.FRAME_WIDTH, -1);
                        var frameHeight = ObjectDataParser._getNumber(textureObject, ObjectDataParser.FRAME_HEIGHT, -1);
                        if (frameWidth > 0 && frameHeight > 0) {
                            textureData.frame = dragonBones.TextureData.generateRectangle();
                            textureData.frame.x = ObjectDataParser._getNumber(textureObject, ObjectDataParser.FRAME_X, 0) * scale;
                            textureData.frame.y = ObjectDataParser._getNumber(textureObject, ObjectDataParser.FRAME_Y, 0) * scale;
                            textureData.frame.width = frameWidth * scale;
                            textureData.frame.height = frameHeight * scale;
                        }
                        textureAtlasData.addTextureData(textureData);
                    }
                }
                return textureAtlasData;
            }
            else {
                throw new Error();
            }
            // return null;
        };
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#parseDragonBonesData()
         */
        ObjectDataParser.getInstance = function () {
            if (!ObjectDataParser._instance) {
                ObjectDataParser._instance = new ObjectDataParser();
            }
            return ObjectDataParser._instance;
        };
        /**
         * @deprecated
         */
        ObjectDataParser._instance = null;
        return ObjectDataParser;
    }(dragonBones.DataParser));
    dragonBones.ObjectDataParser = ObjectDataParser;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 贴图集数据。
     * @version DragonBones 3.0
     */
    var TextureAtlasData = (function (_super) {
        __extends(TextureAtlasData, _super);
        /**
         * @private
         */
        function TextureAtlasData() {
            _super.call(this);
            /**
             * @private
             */
            this.textures = {};
        }
        /**
         * @inheritDoc
         */
        TextureAtlasData.prototype._onClear = function () {
            this.autoSearch = false;
            this.scale = 1;
            this.name = null;
            this.imagePath = null;
            for (var i in this.textures) {
                this.textures[i].returnToPool();
                delete this.textures[i];
            }
        };
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#removeDragonBonesData()
         */
        TextureAtlasData.prototype.dispose = function () {
            this.returnToPool();
        };
        /**
         * @private
         */
        TextureAtlasData.prototype.addTextureData = function (value) {
            if (value && value.name && !this.textures[value.name]) {
                this.textures[value.name] = value;
                value.parent = this;
            }
            else {
                throw new Error();
            }
        };
        /**
         * @private
         */
        TextureAtlasData.prototype.getTextureData = function (name) {
            return this.textures[name];
        };
        return TextureAtlasData;
    }(dragonBones.BaseObject));
    dragonBones.TextureAtlasData = TextureAtlasData;
    /**
     * @private
     */
    var TextureData = (function (_super) {
        __extends(TextureData, _super);
        function TextureData() {
            _super.call(this);
            this.region = new dragonBones.Rectangle();
        }
        TextureData.generateRectangle = function () {
            return new dragonBones.Rectangle();
        };
        /**
         * @inheritDoc
         */
        TextureData.prototype._onClear = function () {
            this.rotated = false;
            this.name = null;
            this.frame = null;
            this.parent = null;
            this.region.clear();
        };
        return TextureData;
    }(dragonBones.BaseObject));
    dragonBones.TextureData = TextureData;
})(dragonBones || (dragonBones = {}));

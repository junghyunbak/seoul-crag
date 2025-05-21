// MarkerOverlapRecognizer class (vanilla JS version)
class MarkerOverlapRecognizer {
  constructor(opts = {}) {
    this._options = Object.assign(
      {
        tolerance: 5,
        highlightRect: true,
        highlightRectStyle: {
          strokeColor: '#ff0000',
          strokeOpacity: 1,
          strokeWeight: 2,
          strokeStyle: 'dot',
          fillColor: '#ff0000',
          fillOpacity: 0.5,
        },
        intersectNotice: true,
        intersectNoticeTemplate:
          '<div style="width:180px;border:solid 1px #333;background-color:#fff;padding:5px;"><em style="font-weight:bold;color:#f00;">{{count}}</em>개의 마커가 있습니다.</div>',
        intersectList: true,
        intersectListTemplate:
          '<div style="width:200px;border:solid 1px #333;background-color:#fff;padding:5px;">' +
          '<ul style="list-style:none;margin:0;padding:0;">' +
          '{{#repeat}}' +
          '<li><a href="#">{{order}}. {{title}}</a></li>' +
          '{{/#repeat}}' +
          '</ul>' +
          '</div>',
      },
      opts
    );

    this._listeners = [];
    this._markers = [];

    this._rectangle = new naver.maps.Rectangle(this._options.highlightRectStyle);
    this._overlapInfoEl = document.createElement('div');
    this._overlapInfoEl.style.position = 'absolute';
    this._overlapInfoEl.style.zIndex = '100';
    this._overlapInfoEl.style.margin = '0';
    this._overlapInfoEl.style.padding = '0';
    this._overlapInfoEl.style.display = 'none';

    this._overlapListEl = this._overlapInfoEl.cloneNode();
  }

  setMap(map) {
    if (map === this.map) return;
    this._unbindEvent();
    this.hide();

    if (map) {
      this._bindEvent(map);
      map.getPanes().floatPane.appendChild(this._overlapInfoEl);
      map.getPanes().floatPane.appendChild(this._overlapListEl);
    }

    this.map = map || null;
  }

  getMap() {
    return this.map;
  }

  _bindEvent(map) {
    const self = this;
    const idleListener = map.addListener('idle', () => self._onIdle());
    const clickListener = map.addListener('click', () => self._onIdle());
    this._listeners.push(idleListener, clickListener);

    this.forEach((marker) => {
      this._listeners.push(...self._bindMarkerEvent(marker));
    });
  }

  _unbindEvent() {
    naver.maps.Event.removeListener(this._listeners);
    this._listeners = [];
    this._rectangle.setMap(null);
    if (this._overlapInfoEl.parentNode) this._overlapInfoEl.parentNode.removeChild(this._overlapInfoEl);
    if (this._overlapListEl.parentNode) this._overlapListEl.parentNode.removeChild(this._overlapListEl);
  }

  add(marker) {
    this._listeners.push(...this._bindMarkerEvent(marker));
    this._markers.push(marker);
  }

  remove(marker) {
    this._markers = this._markers.filter((m) => m !== marker);
    this._unbindMarkerEvent(marker);
  }

  forEach(callback) {
    for (let i = this._markers.length - 1; i >= 0; i--) {
      callback(this._markers[i], i, this._markers);
    }
  }

  hide() {
    this._overlapInfoEl.style.display = 'none';
    this._overlapListEl.style.display = 'none';
    this._rectangle.setMap(null);
  }

  _bindMarkerEvent(marker) {
    const over = naver.maps.Event.addListener(marker, 'mouseover', (e) => this._onOver(e));
    const out = naver.maps.Event.addListener(marker, 'mouseout', (e) => this._onOut(e));
    const down = naver.maps.Event.addListener(marker, 'mousedown', (e) => this._onDown(e));
    marker.__intersectListeners = [over, out, down];
    return marker.__intersectListeners;
  }

  _unbindMarkerEvent(marker) {
    naver.maps.Event.removeListener(marker.__intersectListeners);
    delete marker.__intersectListeners;
  }

  getOverlapRect(marker) {
    const proj = this.getMap().getProjection();
    const offset = proj.fromCoordToOffset(marker.getPosition());
    const t = this._options.tolerance;
    const lt = offset.clone().sub(t, t);
    const rb = offset.clone().add(t, t);
    return naver.maps.PointBounds.bounds(lt, rb);
  }

  getOverlapedMarkers(marker) {
    const baseRect = this.getOverlapRect(marker);
    const overlaped = [{ marker, rect: baseRect }];
    this.forEach((m) => {
      if (m !== marker) {
        const rect = this.getOverlapRect(m);
        if (rect.intersects(baseRect)) {
          overlaped.push({ marker: m, rect });
        }
      }
    });
    return overlaped;
  }

  _onIdle() {
    this.hide();
  }

  _onOver(e) {
    const marker = e.overlay;
    const offset = this.getMap().getProjection().fromCoordToOffset(marker.getPosition());
    const overlaped = this.getOverlapedMarkers(marker);

    if (overlaped.length > 1) {
      if (this._options.highlightRect) {
        let bounds = null;
        for (const item of overlaped) {
          bounds = bounds ? bounds.union(item.rect) : item.rect.clone();
        }
        const min = this.getMap().getProjection().fromOffsetToCoord(bounds.getMin());
        const max = this.getMap().getProjection().fromOffsetToCoord(bounds.getMax());
        this._rectangle.setBounds(naver.maps.LatLngBounds.bounds(min, max));
        this._rectangle.setMap(this.getMap());
      }

      if (this._options.intersectNotice) {
        this._overlapInfoEl.innerHTML = this._options.intersectNoticeTemplate.replace(
          /\{\{count\}\}/g,
          overlaped.length
        );
        this._overlapInfoEl.style.left = `${offset.x}px`;
        this._overlapInfoEl.style.top = `${offset.y}px`;
        this._overlapInfoEl.style.display = 'block';
      }
    } else {
      this.hide();
    }
  }

  _onOut() {
    this.hide();
  }

  _onDown(e) {
    const marker = e.overlay;
    const offset = this.getMap().getProjection().fromCoordToOffset(marker.getPosition());
    const overlaped = this.getOverlapedMarkers(marker);

    naver.maps.Event.resumeDispatch(marker, 'click');

    if (overlaped.length <= 1) return;
    naver.maps.Event.stopDispatch(marker, 'click');
    this._renderIntersectList(overlaped, offset);
    this._overlapInfoEl.style.display = 'none';
    naver.maps.Event.trigger(this, 'overlap', overlaped);
  }

  _renderIntersectList(overlaped, offset) {
    if (!this._options.intersectList) return;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = this._options.intersectListTemplate;
    const ul = wrapper.querySelector('ul');
    this._overlapListEl.innerHTML = '';

    overlaped.forEach((item, i) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = `${i + 1}. ${item.marker.get('title') || item.marker.title}`;
      a.onclick = (evt) => {
        evt.preventDefault();
        naver.maps.Event.resumeDispatch(item.marker, 'click');
        naver.maps.Event.trigger(this, 'clickItem', { overlay: item.marker, originalEvent: evt });
        item.marker.trigger('click');
      };
      li.appendChild(a);
      ul.appendChild(li);
    });

    this._overlapListEl.appendChild(wrapper);
    this._overlapListEl.style.left = `${offset.x + 5}px`;
    this._overlapListEl.style.top = `${offset.y}px`;
    this._overlapListEl.style.display = 'block';
  }

  _guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
      .replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
          v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      })
      .toUpperCase();
  }
}

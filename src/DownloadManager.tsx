type Downloadable = { url: string; arrayBuffer: ArrayBuffer | null };

export interface ItemProgress<T extends Downloadable> {
  started: boolean;
  finished: boolean;
  target: T;
}

type ProgressCallback<T extends Downloadable> = (p: ItemProgress<T>[]) => void;
const fetchNext: <T extends Downloadable>(
  progress: ItemProgress<T>[],
  cb: ProgressCallback<T>
) => void = (progress, cb) => {
  const remainingItems = progress.filter(p => !p.started);
  if (remainingItems.length) {
    remainingItems[0].started = true;
    cb(progress);
    fetch(remainingItems[0].target.url)
      .then(r => r.arrayBuffer())
      .then(r => {
        remainingItems[0].finished = true;
        remainingItems[0].target.arrayBuffer = r;
        cb([...progress]);
        fetchNext(progress, cb);
      });
  }
};

type DownloaderType = <T extends Downloadable>(
  targets: T[],
  inParallel: number,
  // TODO add a "justInTime" flag and convery the  ".target.arrayBuffer" interface to async
  // ... so that we can force pre-loading or allow for downloading on demand.
  cb: (p: ItemProgress<T>[]) => void
) => { status: () => ItemProgress<T>[] };

export const downloader: DownloaderType = (targets, inParallel, cb) => {
  const progress = targets.map(t => ({
    started: false,
    finished: false,
    target: t,
  }));

  Array(inParallel).fill(0).forEach(()=>fetchNext(progress, cb))

  let status = () => progress;
  const manager = {
    status
  };

  return manager;
};

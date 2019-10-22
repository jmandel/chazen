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
  const todo = progress.filter(p => !p.started);
  if (todo.length) {
    todo[0].started = true;
    cb(progress);
    fetch(todo[0].target.url)
      .then(r => r.arrayBuffer())
      .then(r => {
        todo[0].finished = true;
        todo[0].target.arrayBuffer = r;
        cb([...progress]);
        fetchNext(progress, cb);
      });
  }
};

type DownloaderType = <T extends Downloadable>(
  targets: T[],
  cb: (p: ItemProgress<T>[]) => void
) => { status: () => ItemProgress<T>[] };

export const downloader: DownloaderType = (targets, cb) => {
  const progress = targets.map(t => ({
    started: false,
    finished: false,
    target: t,
  }));

  let status = () => progress;
  const manager = {
    status
  };

  return manager;
};

from pydelatin import Delatin
import pydelatin
import xarray as xr
import rioxarray as rxr
from pyproj import Transformer
import math
from scipy.spatial import Delaunay
import numpy as np
import json
import matplotlib.image


def scale_array(arr, max=255, dtype=np.uint8):
    arr_min = np.min(arr)
    original_max = np.max(arr)
    arr = arr - arr_min

    arr_max = np.max(arr)
    arr = (arr / arr_max * max).astype(dtype)
    assert np.max(arr) == max, f"{np.max(arr)} != {max}"
    assert np.min(arr) == 0, f"{np.min(arr)} != {0}"
    return arr, arr_min, original_max


def get_bounds(ds):
    globalx_flat = ds.globalx[0].values.flatten()
    globaly_flat = ds.globaly[0].values.flatten()

    # Calculate the extents (min and max values) of the flattened globalx and globaly
    xmin = np.min(globalx_flat)
    xmax = np.max(globalx_flat)
    ymin = np.min(globaly_flat)
    ymax = np.max(globaly_flat)

    transformer = Transformer.from_crs("EPSG:32620", "EPSG:4326")
    ymin, xmin = transformer.transform(xmin, ymin)
    ymax, xmax = transformer.transform(xmax, ymax)
    return {"xmin": xmin, "xmax": xmax, "ymin": ymin, "ymax": ymax}


def convert_xb_to_png():
    for t in range(9):
        print(t)
        ds = xr.open_dataset("/data/xboutput.nc").isel(meantime=t).squeeze()
        u = ds.u_mean
        v = ds.v_mean
        u_scaled, u_min, u_max = scale_array(u.to_numpy())
        v_scaled, v_min, v_max = scale_array(v.to_numpy())
        metadata = {
            "uMin": float(u_min),
            "uMax": float(u_max),
            "vMin": float(v_min),
            "vMax": float(v_max),
            "shape": [u_scaled.shape[1], u_scaled.shape[0]],
            "bounds": get_bounds(ds),
        }
        with open(f"/data/processed/metadata_t{t}.json", "w") as f:
            f.write(json.dumps(metadata, indent=4))
        output_png = np.moveaxis(
            np.stack(
                [u_scaled, v_scaled, np.zeros(u_scaled.shape).astype(np.uint8), np.ones(u_scaled.shape).astype(np.uint8)*255], axis=0
            ),
            0,
            -1,
        )
        matplotlib.image.imsave(
            f"/data/processed/img_t{t}.png",
            output_png.copy(order='C'),
        )
        # u1 = math.floor(u / 255)
        # print(u)
        break
        continue


def create_initial_particles(res=100):
    arrs = [scale_array(np.random.rand(res, res))[0] for _ in range(4)]
    print([a.shape for a in arrs])
    x = np.moveaxis(np.stack(arrs, axis=0), 0, -1).copy(order='C')
    print(x)
    print(x.shape)
    matplotlib.image.imsave(
        f"/data/processed/random_start.png",
        x,
    )


convert_xb_to_png()
# create_initial_particles()

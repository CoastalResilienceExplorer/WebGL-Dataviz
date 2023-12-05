import xarray as xr
import rioxarray as rxr
from pyproj import Transformer
import numpy as np
import json
import matplotlib.image
import os


def scale_array(arr, max=255, dtype=np.uint8):
    arr_min = np.min(arr)
    original_max = np.max(arr)
    arr = arr - arr_min

    arr_max = np.max(arr)
    arr = (arr / arr_max * max).astype(dtype)
    # assert np.max(arr) == max, f"{np.max(arr)} != {max}"
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


def generate_video(folder):
    import os, subprocess, glob
    os.chdir(folder)
    subprocess.call([
        'ffmpeg', 
        '-framerate', '8', 
        '-pattern_type', 'glob', 
        '-i', '*.png', 
        '-r', '10', 
        '-pix_fmt', 'yuv420p',
        '-vf', 'pad=ceil(iw/2)*2:ceil(ih/2)*2',
        'animation.mp4'
    ])

def convert_xb_uv_to_png():
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

def convert_xb_zs_to_png(folder='/data/processed/zs'):
    if not os.path.exists(folder):
        os.makedirs(folder)
    for t in range(9):
        print(t)
        ds = xr.open_dataset("/data/xboutput.nc").isel(meantime=t).squeeze()
        z = ds.zs_max
        print(z.min())
        print(z.max())
        print(z.to_numpy().shape)
        z_with_rand = z.to_numpy() + (np.random.rand(*z.to_numpy().shape)*100).astype(np.uint8)

        z_scaled, z_min, z_max = scale_array(z_with_rand)
        # z_scaled, z_min, z_max = scale_array(z.to_numpy())
        metadata = {
            "zMin": float(z_min),
            "zMax": float(z_max),
            "shape": [z_scaled.shape[1], z_scaled.shape[0]],
            "bounds": get_bounds(ds),
        }
        print(metadata)
        with open(os.path.join(folder, f"metadata_t{t}_zs.json"), "w") as f:
            f.write(json.dumps(metadata, indent=4))
        output_png = np.moveaxis(
            np.stack(
                [
                    z_scaled, 
                    np.zeros(z_scaled.shape).astype(np.uint8), 
                    np.zeros(z_scaled.shape).astype(np.uint8), 
                    np.ones(z_scaled.shape).astype(np.uint8)*255], axis=0
            ),
            0,
            -1,
        )
        # output_png = np.moveaxis(
        #     np.stack(
        #         [
        #             (np.random.rand(*z_scaled.shape)*255).astype(np.uint8), 
        #             np.zeros(z_scaled.shape).astype(np.uint8), 
        #             np.zeros(z_scaled.shape).astype(np.uint8), 
        #             np.ones(z_scaled.shape).astype(np.uint8)*255], axis=0
        #     ),
        #     0,
        #     -1,
        # )
        matplotlib.image.imsave(
            os.path.join(folder, f"img_t{t}_zs.png"),
            output_png.copy(order='C'),
        )
    generate_video(folder)
    


# convert_xb_uv_to_png()
convert_xb_zs_to_png()


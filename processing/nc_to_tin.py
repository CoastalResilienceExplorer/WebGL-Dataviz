from pydelatin import Delatin
import pydelatin
import xarray as xr
import rioxarray as rxr
from pyproj import Transformer
import math as Math
from scipy.spatial import Delaunay
import numpy as np


for t in range(9):
	print(t)
	ds = xr.open_dataset('/data/xboutput.nc').zs_max.isel(meantime=t).squeeze()
	arr = ds.to_numpy()
	tin = Delatin(arr, max_error=0.5)

	# Flatten the 'globalx' and 'globaly' arrays
	globalx_flat = ds.globalx[0].values.flatten()
	globaly_flat = ds.globaly[0].values.flatten()

	# Calculate the extents (min and max values) of the flattened globalx and globaly
	xmin = np.min(globalx_flat)
	xmax = np.max(globalx_flat)
	ymin = np.min(globaly_flat)
	ymax = np.max(globaly_flat)

	transformer = Transformer.from_crs("EPSG:32620", "EPSG:4326")
	lat_lon = dict()
	lat_lon['lower_left'] = transformer.transform(xmin, ymin)
	lat_lon['upper_right'] = transformer.transform(xmax, ymax)
	rescaled_vertices = pydelatin.util.rescale_positions(
		tin.vertices, 
		[
			lat_lon['lower_left'][1], 
			lat_lon['lower_left'][0],  
			lat_lon['upper_right'][1], 
			lat_lon['upper_right'][0]
		]
	)
	def rescale_xy(pt):
		lng = pt[0]
		lat = pt[1]
		return [
			(lng + 180)/ 360,
			(180 - (180 / Math.pi * Math.log(Math.tan(Math.pi / 4 + lat * Math.pi / 360)))) / 360,
			pt[2]/100000000+0.00000001
		]
	
	with open(f'/data/processed/output_triangles_{t}.js', 'w') as output:
		output.write("export const data = [\n")
		for tri in tin.triangles:
			tri = [tri[0], tri[1], tri[1], tri[2], tri[2], tri[0]]
			for i in tri:
				for v in rescale_xy(rescaled_vertices[i]):
					output.write(str(v))
					output.write(',\n')
		output.write(']')




import { Vector } from '../linear-algebra/vector';
import Component, { ComponentOptions } from './component';

type PathPoint = Vector | number[];

export interface PathOptions extends ComponentOptions {
	closed?: boolean;
}

/**
 * An ordered set of vectors defining a path.
 */
export default class Path extends Component {
	readonly points: Vector[];
	readonly closed: boolean;

	constructor(points: PathPoint[], options?: PathOptions) {
		if (points.length < 2) {
			throw new Error('Path requires at least two points');
		}

		const vectors = points.map((point) => point instanceof Vector ? point : new Vector(point));
		const [min, max] = Vector.extrema(...vectors);

		const width = Math.max(1, max[0] - min[0]);
		const height = Math.max(1, max[1] - min[1]);

		super(width, height, options);

		this.displacement = new Vector([
			options?.x ?? min[0],
			options?.y ?? min[1],
		]);

		this.closed = Boolean(options?.closed);
		this.points = vectors.map((point) => new Vector([
			point[0] - min[0],
			point[1] - min[1],
		]));

		this.path.moveTo(this.points[0][0], this.points[0][1]);
		for (let index = 1; index < this.points.length; index += 1) {
			this.path.lineTo(this.points[index][0], this.points[index][1]);
		}

		if (this.closed) {
			this.path.closePath();
		}
	}

	render() {
		if (this.closed) {
			this.context.fill(this.path);
		}
		this.context.stroke(this.path);
	}
}

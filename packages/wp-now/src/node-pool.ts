import { LatestSupportedPHPVersion, PHPResponse } from '@php-wasm/universal';
import { NodePHP } from '@php-wasm/node';
import { Pool } from './pool';

export type NodePoolOptions = {
	spawn?: () => Promise<NodePHP>;
	reap?: (instance: NodePHP) => void;
	fatal?: (instance: NodePHP, error: any) => any;
	maxRequests?: number;
	maxJobs?: number;
};

const defaultSpawn = async () => await NodePHP.load(LatestSupportedPHPVersion);

const defaultFatal = (instance: NodePHP, error: any) =>
	new PHPResponse(
		500,
		{},
		new TextEncoder().encode(
			`500 Internal Server Error:\n\n${String(
				error && error.stack ? error.stack : error
			)}`
		)
	);

const defaultReap = (instance: NodePHP) => {
	try {
		instance.exit();
	} catch {
		// Do nothing.
	}
};

export class NodePool extends Pool {
	constructor({
		maxRequests = 128,
		maxJobs = 1,
		spawn = defaultSpawn,
		fatal = defaultFatal,
		reap = defaultReap,
	} = {}) {
		super({ maxRequests, maxJobs, spawn, fatal, reap });
	}
}

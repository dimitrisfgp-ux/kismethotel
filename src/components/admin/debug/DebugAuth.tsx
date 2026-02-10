export function DebugAuth({ user, profile, error }: any) {
    return (
        <div className="bg-red-50 border-2 border-red-500 p-4 m-4 rounded text-xs font-mono text-red-900 overflow-auto max-h-40">
            <h3 className="font-bold underline text-sm mb-2">DEBUG: AUTH STATE</h3>
            <p><strong>User ID:</strong> {user?.id}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Profile Role:</strong> {profile?.role || 'NULL (Defaulting to Viewer)'}</p>
            <p><strong>Fetch Error:</strong> {JSON.stringify(error, null, 2)}</p>
            <p><strong>Raw Profile:</strong> {JSON.stringify(profile)}</p>
        </div>
    );
}

import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

export default function SkeletonThemeLoader() {
    return (
        <div>
            <SkeletonTheme baseColor="#d4e0e5">
                <div className="p-2">
                    <div className="skeletion-new p-3">
                        <div className="d-flex mb-2">
                            <Skeleton
                                circle
                                height={20}
                                width={20}
                                style={{ marginRight: "10px" }}
                            />
                            <Skeleton height={17} width={120} />{" "}
                        </div>
                        <Skeleton height={17} width={"100%"} />{" "}
                        <Skeleton height={17} width={"70%"} />
                    </div>
                </div>
            </SkeletonTheme>
            <SkeletonTheme baseColor="#d4e0e5">
                <div className="p-2">
                    <div className="skeletion-new p-3">
                        <div className="d-flex mb-2">
                            <Skeleton
                                circle
                                height={20}
                                width={20}
                                style={{ marginRight: "10px" }}
                            />
                            <Skeleton height={17} width={120} />{" "}
                        </div>
                        <Skeleton height={17} width={"100%"} />{" "}
                        <Skeleton height={17} width={"70%"} />
                    </div>
                </div>
            </SkeletonTheme>{" "}
            <SkeletonTheme baseColor="#d4e0e5">
                <div className="p-2">
                    <div className="skeletion-new p-3">
                        <div className="d-flex mb-2">
                            <Skeleton
                                circle
                                height={20}
                                width={20}
                                style={{ marginRight: "10px" }}
                            />
                            <Skeleton height={17} width={120} />{" "}
                        </div>
                        <Skeleton height={17} width={"100%"} />{" "}
                        <Skeleton height={17} width={"70%"} />
                    </div>
                </div>
            </SkeletonTheme>{" "}
        </div>
    )
}
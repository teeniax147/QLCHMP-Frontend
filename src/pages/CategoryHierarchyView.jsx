import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from '../config';
import {
    Paper,
    Typography,
    Container,
    Box,
    IconButton,
    Tooltip,
    CircularProgress,
    Alert,
    Divider,
    ButtonGroup,
    Button,
    Collapse,
    Breadcrumbs,
    Link as MuiLink,
    Skeleton
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CategoryIcon from '@mui/icons-material/Category';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ViewListIcon from '@mui/icons-material/ViewList';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import InfoIcon from '@mui/icons-material/Info';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';

// Styled components
const HierarchyContainer = styled(Paper)(({ theme }) => ({
    marginTop: theme.spacing(3),
    padding: theme.spacing(3),
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
}));

const BreadcrumbContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1.5),
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
}));

const PageTitle = styled(Typography)(({ theme }) => ({
    fontSize: '1.8rem',
    fontWeight: 600,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    '& svg': {
        marginRight: theme.spacing(1),
        color: theme.palette.primary.main,
    }
}));

const CategoryDescription = styled(Typography)(({ theme }) => ({
    fontSize: '0.85rem',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
}));

const CategoryItemContainer = styled(Box)(({ theme, depth = 0 }) => ({
    borderLeft: depth > 0 ? `1px dashed ${theme.palette.divider}` : 'none',
    marginLeft: depth > 0 ? theme.spacing(2) : 0,
    paddingLeft: depth > 0 ? theme.spacing(2) : 0,
}));

const CategoryItem = styled(Box)(({ theme, selected = false }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1),
    borderRadius: 4,
    marginBottom: theme.spacing(1),
    backgroundColor: selected ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: selected ? alpha(theme.palette.primary.main, 0.15) : alpha(theme.palette.primary.main, 0.05),
    }
}));

const CategoryHierarchyView = () => {
    const [hierarchyData, setHierarchyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [expandedNodes, setExpandedNodes] = useState({});
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [breadcrumbData, setBreadcrumbData] = useState([]);
    const [breadcrumbLoading, setBreadcrumbLoading] = useState(false);
    const [breadcrumbError, setBreadcrumbError] = useState(null);

    const fetchCategoryHierarchy = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
            }

            const response = await axios.get(`${API_BASE_URL}/Categories/hierarchy`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            if (response.status === 200 && response.data) {
                console.log("Response data:", response.data);

                // Lấy dữ liệu từ API
                let rawData = [];
                if (response.data.Categories && response.data.Categories.$values) {
                    rawData = response.data.Categories.$values;
                } else {
                    console.error("Không tìm thấy dữ liệu Categories.$values", response.data);
                    throw new Error("Cấu trúc dữ liệu không hợp lệ");
                }

                // Chuyển đổi các trường từ viết hoa (Id, Name) sang viết thường (id, name)
                const transformData = (item) => {
                    // Đảm bảo item có tồn tại
                    if (!item) return null;

                    return {
                        id: item.Id,
                        name: item.Name,
                        description: item.Description,
                        // Xử lý các danh mục con
                        children: item.Children && item.Children.$values ?
                            item.Children.$values.map(transformData).filter(Boolean) : []
                    };
                };

                // Áp dụng chuyển đổi cho tất cả các mục
                const transformedData = rawData.map(transformData).filter(Boolean);

                console.log("Transformed data:", transformedData);
                setHierarchyData(transformedData);

                // Auto-expand root nodes
                if (transformedData.length > 0) {
                    const initialExpanded = {};
                    transformedData.forEach(item => {
                        if (item.id) {
                            initialExpanded[item.id] = true;
                        }
                    });
                    setExpandedNodes(initialExpanded);
                }
            } else {
                throw new Error("Dữ liệu trả về không hợp lệ.");
            }
        } catch (err) {
            console.error("Lỗi API:", err);
            setError(
                err.response?.data?.message || err.message ||
                "Không thể lấy cấu trúc phân cấp danh mục. Vui lòng kiểm tra lại API hoặc kết nối mạng."
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchBreadcrumb = async (categoryId) => {
        // Skip fetch if no categoryId provided
        if (!categoryId) {
            setBreadcrumbData([]);
            return;
        }

        try {
            setBreadcrumbLoading(true);
            setBreadcrumbError(null);

            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
            }

            const response = await axios.get(`${API_BASE_URL}/Categories/${categoryId}/breadcrumb`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            if (response.status === 200 && response.data) {
                console.log("Breadcrumb response:", response.data);

                // Extract breadcrumb data from response
                let breadcrumbItems = [];
                if (response.data.Breadcrumb && Array.isArray(response.data.Breadcrumb)) {
                    breadcrumbItems = response.data.Breadcrumb;
                } else if (response.data.Breadcrumb && response.data.Breadcrumb.$values) {
                    breadcrumbItems = response.data.Breadcrumb.$values;
                } else {
                    console.error("Không tìm thấy dữ liệu Breadcrumb hợp lệ", response.data);
                    throw new Error("Cấu trúc dữ liệu breadcrumb không hợp lệ");
                }

                // Transform data to consistent format if needed
                const transformedData = breadcrumbItems.map(item => ({
                    id: item.Id || item.id,
                    name: item.Name || item.name
                }));

                setBreadcrumbData(transformedData);
            } else {
                throw new Error("Dữ liệu breadcrumb trả về không hợp lệ.");
            }
        } catch (err) {
            console.error("Lỗi lấy breadcrumb:", err);
            setBreadcrumbError(
                err.response?.data?.message || err.message ||
                "Không thể lấy đường dẫn phân cấp danh mục. Vui lòng thử lại sau."
            );
            setBreadcrumbData([]);
        } finally {
            setBreadcrumbLoading(false);
        }
    };

    useEffect(() => {
        fetchCategoryHierarchy();
    }, []);

    // Fetch breadcrumb when selectedCategoryId changes
    useEffect(() => {
        if (selectedCategoryId) {
            fetchBreadcrumb(selectedCategoryId);
        } else {
            setBreadcrumbData([]);
        }
    }, [selectedCategoryId]);

    const handleToggleNode = (e, nodeId) => {
        e.stopPropagation(); // Prevent click from bubbling to parent
        setExpandedNodes(prev => ({
            ...prev,
            [nodeId]: !prev[nodeId]
        }));
    };

    const handleCategorySelect = (categoryId) => {
        setSelectedCategoryId(categoryId);

        // Make sure the parents of the selected node are expanded
        const expandParents = (categories, targetId, expansionState = {}) => {
            for (const category of categories) {
                if (category.id === targetId) {
                    return true;
                }

                if (category.children && category.children.length > 0) {
                    if (expandParents(category.children, targetId, expansionState)) {
                        expansionState[category.id] = true;
                        return true;
                    }
                }
            }
            return false;
        };

        const newExpandedNodes = { ...expandedNodes };
        expandParents(hierarchyData, categoryId, newExpandedNodes);
        setExpandedNodes(newExpandedNodes);
    };

    // Hàm đệ quy để hiển thị cây danh mục
    const renderCategoryTree = (categories, depth = 0) => {
        if (!categories || categories.length === 0) return null;

        return categories.map((category, index) => {
            // Sử dụng index kết hợp với id để tạo key duy nhất
            const nodeId = category.id ? category.id.toString() : `unknown_${index}`;
            const hasChildren = category.children && category.children.length > 0;
            const isExpanded = expandedNodes[nodeId];
            const isSelected = selectedCategoryId === category.id;

            return (
                <CategoryItemContainer key={nodeId} depth={depth}>
                    <CategoryItem
                        selected={isSelected}
                        onClick={() => handleCategorySelect(category.id)}
                    >
                        <Box display="flex" alignItems="center" width="100%">
                            {hasChildren && (
                                <IconButton
                                    size="small"
                                    onClick={(e) => handleToggleNode(e, nodeId)}
                                    sx={{ mr: 1 }}
                                >
                                    {isExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                                </IconButton>
                            )}
                            {!hasChildren && <Box sx={{ width: 28, height: 28, mr: 1 }} />}

                            <Box flex={1}>
                                <Typography variant="body1" fontWeight={500}>
                                    {category.name}
                                </Typography>
                                {category.description && (
                                    <CategoryDescription variant="body2">
                                        {category.description}
                                    </CategoryDescription>
                                )}
                            </Box>

                            <Box>
                                <Tooltip title="Xem thông tin đường dẫn">
                                    <IconButton
                                        size="small"
                                        color={isSelected ? "primary" : "default"}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCategorySelect(category.id);
                                        }}
                                    >
                                        <InfoIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    </CategoryItem>

                    {hasChildren && (
                        <Collapse in={isExpanded}>
                            {renderCategoryTree(category.children, depth + 1)}
                        </Collapse>
                    )}
                </CategoryItemContainer>
            );
        });
    };

    // Render Breadcrumb Component
    const renderBreadcrumb = () => {
        if (!selectedCategoryId) return null;

        if (breadcrumbLoading) {
            return (
                <BreadcrumbContainer>
                    <Skeleton width="100%" height={40} />
                </BreadcrumbContainer>
            );
        }

        if (breadcrumbError) {
            return (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {breadcrumbError}
                </Alert>
            );
        }

        return (
            <BreadcrumbContainer>
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    aria-label="đường dẫn phân cấp danh mục"
                >
                    <MuiLink
                        component={Link}
                        to="/admin/categories"
                        underline="hover"
                        color="inherit"
                        sx={{ display: 'flex', alignItems: 'center' }}
                    >
                        <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
                        Trang chủ
                    </MuiLink>
                    <MuiLink
                        component={Link}
                        to="/admin/categories"
                        underline="hover"
                        color="inherit"
                    >
                        Danh mục
                    </MuiLink>

                    {breadcrumbData.map((item, index) => {
                        // Last item should be non-clickable
                        const isLastItem = index === breadcrumbData.length - 1;

                        return isLastItem ? (
                            <Typography key={item.id} color="text.primary">
                                {item.name}
                            </Typography>
                        ) : (
                            <MuiLink
                                component={Link}
                                key={item.id}
                                to={`/admin/categories/${item.id}`}
                                underline="hover"
                                color="inherit"
                            >
                                {item.name}
                            </MuiLink>
                        );
                    })}
                </Breadcrumbs>
            </BreadcrumbContainer>
        );
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Page Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <PageTitle variant="h4">
                    <CategoryIcon fontSize="large" />
                    Cấu Trúc Phân Cấp Danh Mục
                </PageTitle>
                <ButtonGroup variant="contained">
                    <Button
                        component={Link}
                        to="/admin/categories"
                        startIcon={<ViewListIcon />}
                    >
                        Xem dạng bảng
                    </Button>
                    <Button
                        color="primary"
                        startIcon={<AccountTreeIcon />}
                        disabled
                    >
                        Xem cấu trúc phân cấp
                    </Button>
                </ButtonGroup>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Breadcrumb Display */}
            {renderBreadcrumb()}

            {/* Alerts */}
            {successMessage && (
                <Alert
                    severity="success"
                    variant="filled"
                    sx={{ mb: 2, borderRadius: 2, boxShadow: 2 }}
                    onClose={() => setSuccessMessage("")}
                >
                    {successMessage}
                </Alert>
            )}

            {errorMessage && (
                <Alert
                    severity="error"
                    variant="filled"
                    sx={{ mb: 2, borderRadius: 2, boxShadow: 2 }}
                    onClose={() => setErrorMessage("")}
                >
                    {errorMessage}
                </Alert>
            )}

            {/* Loading State */}
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" py={5}>
                    <CircularProgress />
                    <Typography ml={2} variant="body1" color="text.secondary">
                        Đang tải cấu trúc danh mục...
                    </Typography>
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                    {error}
                </Alert>
            ) : (
                <HierarchyContainer>
                    {!selectedCategoryId && (
                        <Alert severity="info" sx={{ mb: 3 }}>
                            Chọn một danh mục để xem đường dẫn phân cấp của nó
                        </Alert>
                    )}

                    {hierarchyData.length === 0 ? (
                        <Box display="flex" justifyContent="center" py={4}>
                            <Typography variant="body1" color="text.secondary">
                                Không có dữ liệu danh mục phân cấp
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ mt: 2 }}>
                            {renderCategoryTree(hierarchyData)}
                        </Box>
                    )}
                </HierarchyContainer>
            )}
        </Container>
    );
};

export default CategoryHierarchyView;
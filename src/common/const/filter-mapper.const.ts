import {
  Any, ArrayContainedBy, ArrayContains, ArrayElement, ArrayOverlap, Between, ILike, In, IsNull, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Not,
  Like,ArrayOperator, FindOptions, FindOperator, FindManyOptions
} from 'typeorm';


export const FILTER_MAPPER = {
  any:Any,
  array_contained_by:ArrayContainedBy,
  array_contains:ArrayContains,
  array_overlap:ArrayOverlap,
  between:Between,
  i_like:ILike,
  in:In,
  is_null:IsNull,
  less_than:LessThan,
  less_than_or_equal:LessThanOrEqual,
  more_than:MoreThan,
  more_than_or_equal:MoreThanOrEqual,
  not:Not,
  like:Like,
}
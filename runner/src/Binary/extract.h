#pragma once

#include <functional>
#include <vector>

namespace Binary {
template <typename T>
T* extract(const char* binary, unsigned long offset)
{
  return (T*)(binary + offset);
}

template <typename T>
struct ExtractArrayItemResult {
  T data;
  int offset;
};

template <typename T>
struct ExtractArrayResult {
  std::vector<T> data;
  int offset;
};

template <typename T>
ExtractArrayResult<T> extract_array(
  const char* binary,
  int offset,
  std::function<ExtractArrayItemResult<T>(const char* binary, int offset)> mapper
)
{
  auto length = extract<unsigned int>(binary, offset);
  offset += sizeof(unsigned int);
  std::vector<T> result;

  for (unsigned int i = 0; i < *length; i++) {
    auto next = mapper(binary, offset);
    result.push_back(next.data);
    offset = next.offset;
  }

  return { result, offset };
}
}
